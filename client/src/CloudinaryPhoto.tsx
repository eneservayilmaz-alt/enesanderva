import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import { auto } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity'

const cloudinary = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME }, url: { secure: true } })

type CloudinaryPhotoProps = {
  publicId: string
  alt: string
  width?: number
  height?: number
  className?: string
}

function CloudinaryPhoto({ publicId, alt, width = 900, height = 700, className }: CloudinaryPhotoProps) {
  const image = cloudinary
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(width).height(height))

  return <AdvancedImage cldImg={image} alt={alt} className={className} />
}

export default CloudinaryPhoto
