import app from "./app";
import dotenv from "dotenv";

// โหลดค่าจากไฟล์ .env
dotenv.config();

const PORT = process.env.PORT || 5000;

// เริ่มต้นรัน Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
});
