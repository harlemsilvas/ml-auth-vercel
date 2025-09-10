// models/Token.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  access_token: String,
  refresh_token: String,
  user_id: Number,
  expires_in: Number,
  created_at: { type: Date, default: Date.now },
});

tokenSchema.index({ user_id: 1 }, { unique: true });

export default mongoose.models.Token || mongoose.model("Token", tokenSchema);
