import mongoose from 'mongoose';

const ProgramStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  durationMin: { type: Number },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  tags: [String],
});

const InfoBlockSchema = new mongoose.Schema({
  key: { type: String, required: true },
  title: String,
  content: String,
  imageUrl: String,
});

const MediaSchema = new mongoose.Schema({
  title: String,
  url: { type: String, required: true },
  type: { type: String, enum: ['image','video'], default: 'image' },
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date },
  venue: {
    name: String,
    address: String,
    googleMapsLink: String,
    geo: { lat: Number, lng: Number },
  },
  program: [ProgramStepSchema],
  menus: [MenuItemSchema],
  infos: [InfoBlockSchema],
  media: [MediaSchema],
  isPublished: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export default mongoose.model('Event', EventSchema);
