'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_HOME_CARD_TITLES = ['venters', 'listeners', 'community']
const ALLOWED_HOME_CARD_TITLE_SET = new Set(ALLOWED_HOME_CARD_TITLES)
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export async function moderatePostAction(formData) {
  const authResult = await getAuthorizedSupabase()
  if (authResult.error) {
    return authResult.error
  }

  const { supabase, session } = authResult
  const postId = String(formData.get('postId') || '').trim()
  const moderationStatus = String(formData.get('moderationStatus') || '').trim().toLowerCase()
  const moderationReason = String(formData.get('moderationReason') || '').trim() || null
  const reportId = String(formData.get('reportId') || '').trim()

  if (!postId) {
    return { status: 'error', message: 'Missing post id.' }
  }

  if (!['active', 'hidden', 'removed'].includes(moderationStatus)) {
    return { status: 'error', message: 'Choose a valid post moderation action.' }
  }

  const payload =
    moderationStatus === 'active'
      ? {
          moderation_status: 'active',
          moderation_reason: null,
          moderated_at: null,
          moderated_by: null,
        }
      : {
          moderation_status: moderationStatus,
          moderation_reason: moderationReason,
          moderated_at: new Date().toISOString(),
          moderated_by: session.user.id,
        }

  const { error } = await supabase.from('posts').update(payload).eq('id', postId)

  if (error) {
    return { status: 'error', message: `Could not update this post. ${error.message}` }
  }

  if (reportId) {
    await supabase
      .from('moderation_reports')
      .update({
        status: moderationStatus === 'active' ? 'reviewing' : 'actioned',
        action_taken: moderationStatus === 'active' ? null : `post_${moderationStatus}`,
        admin_note: moderationReason,
        resolved_at: moderationStatus === 'active' ? null : new Date().toISOString(),
        resolved_by: moderationStatus === 'active' ? null : session.user.id,
      })
      .eq('id', reportId)
  }

  revalidatePath('/admin')

  return {
    status: 'success',
    message:
      moderationStatus === 'active'
        ? 'Post restored successfully.'
        : `Post marked as ${moderationStatus}.`,
  }
}

export async function moderateUserAction(formData) {
  const authResult = await getAuthorizedSupabase()
  if (authResult.error) {
    return authResult.error
  }

  const { supabase, session } = authResult
  const userId = String(formData.get('userId') || '').trim()
  const accountStatus = String(formData.get('accountStatus') || '').trim().toLowerCase()
  const moderationReason = String(formData.get('moderationReason') || '').trim() || null
  const suspendedUntilRaw = String(formData.get('suspendedUntil') || '').trim()
  const reportId = String(formData.get('reportId') || '').trim()

  if (!userId) {
    return { status: 'error', message: 'Missing user id.' }
  }

  if (!['active', 'suspended', 'banned'].includes(accountStatus)) {
    return { status: 'error', message: 'Choose a valid user moderation action.' }
  }

  if (userId === session.user.id && accountStatus !== 'active') {
    return { status: 'error', message: 'Admins cannot restrict their own account from this panel.' }
  }

  const suspendedUntil =
    accountStatus === 'suspended' && suspendedUntilRaw
      ? new Date(suspendedUntilRaw).toISOString()
      : null

  const payload =
    accountStatus === 'active'
      ? {
          account_status: 'active',
          moderation_reason: null,
          moderated_at: null,
          moderated_by: null,
          suspended_until: null,
        }
      : {
          account_status: accountStatus,
          moderation_reason: moderationReason,
          moderated_at: new Date().toISOString(),
          moderated_by: session.user.id,
          suspended_until: accountStatus === 'suspended' ? suspendedUntil : null,
        }

  const { error } = await supabase.from('users').update(payload).eq('id', userId)

  if (error) {
    return { status: 'error', message: `Could not update this user. ${error.message}` }
  }

  if (reportId) {
    await supabase
      .from('moderation_reports')
      .update({
        status: accountStatus === 'active' ? 'reviewing' : 'actioned',
        action_taken: accountStatus === 'active' ? null : `user_${accountStatus}`,
        admin_note: moderationReason,
        resolved_at: accountStatus === 'active' ? null : new Date().toISOString(),
        resolved_by: accountStatus === 'active' ? null : session.user.id,
      })
      .eq('id', reportId)
  }

  revalidatePath('/admin')

  return {
    status: 'success',
    message:
      accountStatus === 'active'
        ? 'User account restored successfully.'
        : `User marked as ${accountStatus}.`,
  }
}

export async function updateModerationReportStatusAction(formData) {
  const authResult = await getAuthorizedSupabase()
  if (authResult.error) {
    return authResult.error
  }

  const { supabase, session } = authResult
  const reportId = String(formData.get('reportId') || '').trim()
  const status = String(formData.get('status') || '').trim().toLowerCase()
  const adminNote = String(formData.get('adminNote') || '').trim() || null

  if (!reportId) {
    return { status: 'error', message: 'Missing report id.' }
  }

  if (!['pending', 'reviewing', 'actioned', 'dismissed'].includes(status)) {
    return { status: 'error', message: 'Choose a valid report status.' }
  }

  const payload = {
    status,
    admin_note: adminNote,
    resolved_at: ['actioned', 'dismissed'].includes(status) ? new Date().toISOString() : null,
    resolved_by: ['actioned', 'dismissed'].includes(status) ? session.user.id : null,
  }

  const { error } = await supabase.from('moderation_reports').update(payload).eq('id', reportId)

  if (error) {
    return { status: 'error', message: `Could not update this report. ${error.message}` }
  }

  revalidatePath('/admin')

  return { status: 'success', message: `Report marked as ${status}.` }
}

export async function uploadHomeCardImages(_prevState, formData) {
  const authResult = await getAuthorizedSupabase()
  if (authResult.error) {
    return authResult.error
  }

  const { supabase } = authResult

  const title = String(formData.get('title') || '').trim().toLowerCase()
  const files = formData
    .getAll('images')
    .filter((file) => file instanceof File && file.size > 0)

  if (!ALLOWED_HOME_CARD_TITLE_SET.has(title)) {
    return { status: 'error', message: 'Choose a valid home card section before uploading.' }
  }

  if (files.length === 0) {
    return { status: 'error', message: 'Select at least one image to upload.' }
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return {
        status: 'error',
        message: `"${file.name}" is not an image. Please upload image files only.`,
      }
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        status: 'error',
        message: `"${file.name}" is larger than 10MB. Please use a smaller image.`,
      }
    }
  }

  const imageUrls = []

  for (const file of files) {
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
    const filePath = `${title}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('home-cards')
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return {
        status: 'error',
        message: `Upload failed for "${file.name}". ${uploadError.message}`,
      }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('home-cards').getPublicUrl(filePath)

    imageUrls.push(publicUrl)
  }

  const { error: dbError } = await supabase
    .from('home_card_images')
    .insert(imageUrls.map((imageUrl) => ({ title, image_url: imageUrl })))

  if (dbError) {
    return {
      status: 'error',
      message: `Images uploaded, but saving them in the database failed. ${dbError.message}`,
    }
  }

  revalidatePath('/admin')

  return {
    status: 'success',
    message: `${files.length} image${files.length === 1 ? '' : 's'} uploaded to ${title}.`,
  }
}

export async function updateHomeCardImage(_prevState, formData) {
  const authResult = await getAuthorizedSupabase()
  if (authResult.error) {
    return authResult.error
  }

  const { supabase } = authResult
  const id = String(formData.get('id') || '').trim()
  const currentImageUrl = String(formData.get('currentImageUrl') || '').trim()
  const title = String(formData.get('title') || '').trim().toLowerCase()
  const replacementImage = formData.get('replacementImage')
  const nextImageFile =
    replacementImage instanceof File && replacementImage.size > 0
      ? replacementImage
      : null

  if (!id && !currentImageUrl) {
    return { status: 'error', message: 'This image record is missing its identifier.' }
  }

  if (!ALLOWED_HOME_CARD_TITLE_SET.has(title)) {
    return { status: 'error', message: 'Choose a valid home card section before saving.' }
  }

  if (nextImageFile) {
    const fileError = validateImageFile(nextImageFile)
    if (fileError) {
      return fileError
    }
  }

  const payload = { title }
  let nextImageUrl = currentImageUrl

  if (nextImageFile) {
    const uploadResult = await uploadHomeCardFile(supabase, title, nextImageFile)
    if (uploadResult.error) {
      return uploadResult.error
    }

    nextImageUrl = uploadResult.publicUrl
    payload.image_url = nextImageUrl
  }

  const updateQuery = supabase.from('home_card_images').update(payload)
  const scopedUpdateQuery = id
    ? updateQuery.eq('id', id)
    : updateQuery.eq('image_url', currentImageUrl)

  const { error: updateError } = await scopedUpdateQuery

  if (updateError) {
    return {
      status: 'error',
      message: `Could not update this home card image. ${updateError.message}`,
    }
  }

  if (nextImageFile && currentImageUrl && currentImageUrl !== nextImageUrl) {
    await removeImageFromStorage(supabase, currentImageUrl)
  }

  revalidatePath('/admin')

  return {
    status: 'success',
    message: nextImageFile
      ? 'Home card image updated successfully.'
      : 'Home card details saved successfully.',
  }
}

export async function deleteHomeCardImage(_prevState, formData) {
  const authResult = await getAuthorizedSupabase()
  if (authResult.error) {
    return authResult.error
  }

  const { supabase } = authResult
  const id = String(formData.get('id') || '').trim()
  const imageUrl = String(formData.get('imageUrl') || '').trim()

  if (!id && !imageUrl) {
    return { status: 'error', message: 'This image record is missing its identifier.' }
  }

  const deleteQuery = supabase.from('home_card_images').delete()
  const scopedDeleteQuery = id ? deleteQuery.eq('id', id) : deleteQuery.eq('image_url', imageUrl)
  const { error: deleteError } = await scopedDeleteQuery

  if (deleteError) {
    return {
      status: 'error',
      message: `Could not delete this home card image. ${deleteError.message}`,
    }
  }

  if (imageUrl) {
    await removeImageFromStorage(supabase, imageUrl)
  }

  revalidatePath('/admin')

  return {
    status: 'success',
    message: 'Home card image deleted successfully.',
  }
}

function sanitizeFileName(fileName) {
  return String(fileName)
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
}

async function getAuthorizedSupabase() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      error: { status: 'error', message: 'Your session has expired. Please sign in again.' },
    }
  }

  const { data: adminUser, error: adminUserError } = await supabase
    .from('users')
    .select('id, is_admin')
    .eq('id', session.user.id)
    .maybeSingle()

  if (adminUserError || !adminUser?.is_admin) {
    return {
      error: { status: 'error', message: 'Only admins can manage home card images.' },
    }
  }

  return { supabase, session }
}

function validateImageFile(file) {
  if (!file.type.startsWith('image/')) {
    return {
      status: 'error',
      message: `"${file.name}" is not an image. Please upload image files only.`,
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      status: 'error',
      message: `"${file.name}" is larger than 10MB. Please use a smaller image.`,
    }
  }

  return null
}

async function uploadHomeCardFile(supabase, title, file) {
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
  const filePath = `${title}/${fileName}`

  const { error: uploadError } = await supabase.storage.from('home-cards').upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })

  if (uploadError) {
    return {
      error: {
        status: 'error',
        message: `Upload failed for "${file.name}". ${uploadError.message}`,
      },
    }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('home-cards').getPublicUrl(filePath)

  return { filePath, publicUrl }
}

async function removeImageFromStorage(supabase, publicUrl) {
  const filePath = getStoragePathFromPublicUrl(publicUrl)

  if (!filePath) {
    return
  }

  await supabase.storage.from('home-cards').remove([filePath])
}

function getStoragePathFromPublicUrl(publicUrl) {
  if (!publicUrl) {
    return null
  }

  const marker = '/storage/v1/object/public/home-cards/'
  const markerIndex = publicUrl.indexOf(marker)

  if (markerIndex === -1) {
    return null
  }

  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length))
}
