'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_HOME_CARD_TITLES = new Set(['venters', 'listeners', 'community'])
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export async function uploadHomeCardImages(_prevState, formData) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { status: 'error', message: 'Your session has expired. Please sign in again.' }
  }

  const { data: adminUser, error: adminUserError } = await supabase
    .from('users')
    .select('id, is_admin')
    .eq('id', session.user.id)
    .maybeSingle()

  if (adminUserError || !adminUser?.is_admin) {
    return { status: 'error', message: 'Only admins can upload home card images.' }
  }

  const title = String(formData.get('title') || '').trim().toLowerCase()
  const files = formData
    .getAll('images')
    .filter((file) => file instanceof File && file.size > 0)

  if (!ALLOWED_HOME_CARD_TITLES.has(title)) {
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

function sanitizeFileName(fileName) {
  return String(fileName)
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
}
