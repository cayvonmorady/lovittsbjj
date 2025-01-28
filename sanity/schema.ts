import homepage from './schemas/homepage'
import pricing from './schemas/pricing'
import gallery from './schemas/gallery'
import instructor from './schemas/instructor'
import schedule from './schemas/schedule'
import galleryImage from './schemas/galleryImage'
import classSchema from './schemas/class'

export const schema = {
  types: [homepage, pricing, gallery, instructor, schedule, galleryImage, classSchema],
}
