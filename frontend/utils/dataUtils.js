export async function fetchProcessedData(query1, query2) {
	try {
		const response = await fetch(`/api/getProcessedData?query1=${query1}&query2=${query2}`, {
			method: 'GET',
		});

		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		console.log('Received Data:', data);
		return data;
	} catch (error) {
		console.error('❌ Error fetching processed data:', error);
		return null;
	}
}

// http-post (SAVE DATA)
export async function saveContractData(data) {
	console.log('entered saveContractData (저장하러 들어옴)');
	const apiUrlEndpoint = `https://conan.ai/_functions/saveData`;

	const body = JSON.stringify({
		// id: data.id,
		data: data,
	});

	return fetch(apiUrlEndpoint, {
		method: 'post',
		body,
	})
		.then(response => {
			console.log('response', response);
			if (response.ok) {
				// setSaveToastState(true);
				return response.json();
			}
			return Promise.reject('fetch to wix function has failed ' + response.status);
		})
		.catch(e => {
			console.log(`Error :  ${String(e)}`);
		});
}
