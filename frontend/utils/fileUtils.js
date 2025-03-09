export function exportContent(clause_array, input_array, fileName) {
	// console.log("Export Document");
	// console.log("clause_array", clause_array);

	// let cNum = 0
	// let newState = [...clause_array].map(obj => {
	//   if (obj.is_default === true && obj.is_clause === true) {
	//     cNum = cNum + 1
	//     return (`${cNum}. ` + obj.clause_title_en).concat(obj.content_en)
	//   } else if (obj.is_default === true && obj.is_clause !== true) {
	//     return obj.content_en
	//   }
	//   return obj
	// })
	// console.log('newState', newState)

	const mapped_clause = clause_array.map(function (x) {
		if (x.is_default == true) return x.content_en;
	});

	let cNo = 0;
	const mapped_title = clause_array.map(function (x) {
		if (x.is_default === true) {
			if (x.is_clause === true) {
				cNo = cNo + 1;
				return `${cNo}. ` + x.clause_title_en;
			}
			return x.clause_title_en;
		}
	});
	console.log('mapped_clause', mapped_clause);
	console.log('mapped_title', mapped_title);

	let dataToExport = [];
	for (let i = 0; i < mapped_clause.length; i++) {
		if (mapped_title[i] !== undefined) {
			mapped_title[i] = '<b>' + mapped_title[i] + '</b>';
			dataToExport[dataToExport.length] = mapped_title[i].concat(mapped_clause[i]);
		} else {
			dataToExport[dataToExport.length] = mapped_clause[i];
		}
	}
	dataToExport = dataToExport.filter(function (element) {
		return element !== undefined;
	});
	let title = `<h1 style="font-weight:bold;text-align:center">${fileName} 계약서</h1>`;
	dataToExport = [title].concat(dataToExport);
	console.log('dataToExport', dataToExport);
	//
	let newContent = dataToExport.join(' <br /> ');

	for (let i = 0; i < input_array.length; i++) {
		if (input_array[i].value !== '') {
			newContent = newContent.replace(new RegExp(`{${input_array[i].placeholder}}`, 'gi'), `{${input_array[i].value}}`);
		} else {
			newContent = newContent.replace(new RegExp(`{${input_array[i].placeholder}}`, 'gi'), `<span style="color:#000000;font-weight:bold">[${input_array[i].placeholder}]</span>`);
		}
	}

	newContent = newContent.replace(new RegExp(`<b>`, 'gi'), `<h2>`);
	newContent = newContent.replace(new RegExp(`</b>`, 'gi'), `</h2>`);
	// newContent = newContent.replace(new RegExp(`<span style="color:#ffffff;font-weight:bold;text-decoration:underline;background-color:#8C53A0">`, 'gi'), `<span style="color:#000000;font-weight:bold;background-color:#CFF4C6">`)
	// newContent = newContent.replace(new RegExp(`<span style="color:#000000;background-color:#D4BCDC">`, 'gi'), `<span style="color:#000000;font-weight:bold;background-color:#CFF4C6">`)

	//   newContent = newContent.replace(
	//     new RegExp(`<span class="variable" style="color:#ffffff;font-weight:bold;text-decoration:underline;background-color:#8C53A0">`, 'gi'),
	//     `<span style="color:#000000;font-weight:bold;background-color:#CFF4C6">`
	//   )
	//   newContent = newContent.replace(new RegExp(`<span class="drafted" style="color:#000000;background-color:#D4BCDC">`, 'gi'), `<span style="color:#000000;font-weight:bold;background-color:#CFF4C6">`)
	//   newContent = newContent.replace(new RegExp(`style="color:#000000;background-color:#D4BCDC"`, 'gi'), `style="color:#000000;font-weight:bold;background-color:#CFF4C6"`)

	// newContent = newContent.replace(new RegExp(`<p>`, 'gi'), `<p style="font-family: Arial">`);
	//   $w('#html7').postMessage({ content: newContent })
	exportDoc(newContent, fileName);
}

export function exportDoc(element, filename) {
	var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'>";

	var style =
		"<style type='text/css'>p, h2, h3 {font-family:Malgun Gothic; text-align:justify; font-size:10pt; margin-bottom: 0px; margin-top: 0px;line-height:115%;} h1 {font-family:Malgun Gothic; font-size:12pt; margin-bottom: 0px; margin-top: 0px;line-height:115%;}</style></head><body>";

	var footer = '</body></html>';
	// var html = header+element+footer;
	var html = header + style + element + footer;
	// console.log(html);
	var blob = new Blob(['\ufeff', html], {
		type: 'application/msword',
	});

	// Specify link url
	var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

	filename = filename + '계약서';
	// Specify file name
	filename = filename ? filename + '.doc' : 'document.doc';

	// Create download link element
	var downloadLink = document.createElement('a');
	document.body.appendChild(downloadLink);

	if (navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, filename);
	} else {
		// Create a link to the file
		downloadLink.href = url;
		// Setting the file name
		downloadLink.download = filename;
		//triggering the function
		downloadLink.click();
	}
	document.body.removeChild(downloadLink);
}
