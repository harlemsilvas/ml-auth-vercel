// models/Token.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  expires_in: { type: Number, default: 21600 },
  created_at: { type: Date, default: Date.now },
  nickname: { type: String }, // ← Novo campo
});

tokenSchema.index({ user_id: 1 }, { unique: true });

export default mongoose.models.Token || mongoose.model("Token", tokenSchema);
// models/Token.js
// import mongoose from "mongoose";

// const tokenSchema = new mongoose.Schema({
//   access_token: { type: String, required: true },
//   refresh_token: { type: String, required: true },
//   user_id: { type: Number, required: true },
//   expires_in: { type: Number, default: 21600 },
//   created_at: { type: Date, default: Date.now },
// });

// tokenSchema.index({ user_id: 1 }, { unique: true });

// export default mongoose.models.Token || mongoose.model("Token", tokenSchema);
