import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'
const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  console.error('Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in .env before seeding.')
  process.exit(1)
}
try {
  await mongoose.connect(MONGODB_URI)
  const email = ADMIN_EMAIL.trim().toLowerCase()
  const existing = await User.findOne({ email })
  if (existing) { existing.role = 'admin'; await existing.save(); console.log('Existing account granted admin role:', email) }
  else { await User.create({ name: 'Portfolio Administrator', email, password: ADMIN_PASSWORD, role: 'admin' }); console.log('Administrator created:', email) }
} catch (err) { console.error('Admin setup failed:', err.message); process.exitCode = 1 }
finally { await mongoose.disconnect() }
