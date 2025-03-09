import axios from 'axios';

export default async function handle(req, res) {
	try {
		const API_BASE_URL = 'http://localhost:8080/api';

		// 클라이언트에서 query1, query2를 GET 요청 파라미터로 받음
		const { query1, query2 } = req.query;

		// 백엔드 API 호출 (GET 방식)
		const response = await axios.get(`${API_BASE_URL}/data/process`, {
			params: { query1, query2 }, // 쿼리 파라미터 설정
		});

		// 성공한 경우 클라이언트에 데이터 반환
		res.status(200).json(response.data);
	} catch (error) {
		console.error('❌ API 요청 실패:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
