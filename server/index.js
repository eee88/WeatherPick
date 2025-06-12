const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 4000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 장소명 검색
app.post("/searchPlace", async (req, res) => {
  const { placeName } = req.body;
  
  try {
    const response = await axios.get(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(placeName)}&display=10`,
      {
        headers: {
          "X-Naver-Client-Id": "Aagw6ghMezsqQ5qxNO9B",
          "X-Naver-Client-Secret": "DE2kKZgkZ0",
        },
      }
    );
    
    if (!response.data.items) {
      return res.json({ places: [] });
    }
    
    res.json({ places: response.data.items });
    console.log("응답값", response.data);
  } catch (error) {
    console.error("Error searching for place:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 