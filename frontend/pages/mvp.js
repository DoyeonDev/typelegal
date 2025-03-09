import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import PrivacyModal from '../components/modals/PrivacyModal';
// import { sendEmail } from './/api/sendEmail'
// import { SENDGRID_API_KEY } from '../config'
import { v4 as uuidv4 } from 'uuid';
// import SurveyModal from '../components/modals/surveyModal'
// import { useRouter } from 'next/router'
// import { EMAIL_REGEX_VALIDATION, PASSWORD_REGEX_VALIDATION, PHONE_REGEX_VALIDATION } from '../lib/lib'

export default function Mvp() {
	require('dotenv').config();
	useEffect(() => {
		async function getPageData() {
			localStorage.theme = 'light';
		}
		getPageData();
	}, []);

	// const [disabled, setDisabled] = useState(true)
	const [isChecked, setIsChecked] = useState(false); // Personal Information Collection Agree
	const [isOpen, setIsOpen] = useState(false); // Privacy Policy Modal
	const [submitted, setSubmitted] = useState(false);
	const [input, setInput] = useState({
		userName: '',
		userPhone: '',
		userEmail: '',
		userCareer: '',
		userField: '',
		activationKey: uuidv4(),
	});

	// 사이트에서 나가시겠습니까? 변경사항이 저장되지 않을 수 있습니다.
	useEffect(() => {
		if (!submitted) {
			const unloadCallback = event => {
				event.preventDefault();
				event.returnValue = '';
				return '';
			};
			window.addEventListener('beforeunload', unloadCallback);
			return () => window.removeEventListener('beforeunload', unloadCallback);
		}
	}, [submitted]);

	const questionData = [
		{ id: 'q1', label: '1. 이름', required: true, type: 'text', name: 'userName', placeholder: '이름을 입력해주세요' },
		{ id: 'q2', label: '2. 연락처', required: true, type: 'text', name: 'userPhone', placeholder: '010-1234-5678' },
		{ id: 'q3', label: '3. 이메일', required: true, type: 'email', name: 'userEmail', placeholder: 'name@company.com' },
		{ id: 'q4', label: '✨ 디자인 전문 분야 ✨', required: true, type: 'text', name: 'userField', placeholder: '디자이너님이 어떤 작업을 주로 하시는지 궁금해요 🙂' },
		{
			id: 'q5',
			label: '✨ 프리랜서 경력 ✨',
			required: true,
			subTitle: '예) "8년차 프리랜서 브랜드 디자이너" , "곧 정식으로 시작할 예정입니다" 등',
			type: 'text',
			name: 'userCareer',
			placeholder: '프리랜서로서 활동한 기간이 어떻게 되나요?',
		},
	];

	const onInputChange = e => {
		const { name, value } = e.target;
		console.log('input', input);
		setInput(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const { userName, userEmail, userPhone } = input;
	const submitEmail = async e => {
		// e.preventDefault()
		// console.log('input', JSON.stringify(input))
		try {
			await fetch('/api/sendEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify(input),
			});
		} catch (err) {
			console.log('err', err);
		}
	};

	const submitAutoEmail = async e => {
		// e.preventDefault()
		// console.log('input', JSON.stringify(input))
		let notificationInfo = { userEmail: input.userEmail, userName: input.userName, eventType: '체험 아이디', eventAction: '신청' };

		try {
			await fetch('/api/sendAutoEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify(notificationInfo),
			});
		} catch (err) {
			console.log('err', err);
		}
	};

	const onSubmit = () => {
		// console.log(input)
		let register = { user_email: input.userEmail, user_phone: input.userPhone, user_name: input.userName, user_career: input.userCareer, user_field: input.userField, activation_key: input.activationKey };

		if (register.user_email !== '' && register.user_phone !== '' && register.user_name !== '' && register.user_career !== '' && register.user_field !== '') {
			registerMvp(register);
			setSubmitted(true);
			submitEmail();
			submitAutoEmail();
		}
	};

	return (
		<>
			<Head>
				<title>타입리걸</title>
				<meta name="description" content="계약서 작성의 시작, 타입리걸 체험 아이디 신청" />
				<meta property="og:title" content="타입리걸 체험 아이디 신청" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{!submitted ? (
				<section>
					<div className={`h-screen bg-white flex flex-col items-center justify-center mx-auto ${submitted && 'cursor-progress'}`}>
						<div className="grid items-center place-content-center w-full h-full shadow-inner dark:border dark:bg-gray-800 dark:border-gray-700">
							<div className="w-full bg-white flex flex-col pt-6 pb-2 space-y-4">
								<Link href="/" className="flex mx-auto items-center text-2xl font-semibold mb-4">
									<Image alt="타입리걸" src="/icon/typelegal.png" width={0} height={0} sizes="100vw" className="w-[140px]" />
								</Link>
								<h1 className="text-center text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white">안녕하세요 타입리걸입니다!</h1>
								{/* <p className="text-center text-sm text-gray-400">타입리걸 베타 서비스 신청하기</p> */}
								{/* <span>
                  <p className="text-center text-gray-400">타입리걸은 베타랑 변호사와 젊은 기획자들이 만든 서비스입니다</p>
                </span> */}
							</div>
							<form className="w-[560px] p-6 space-y-8 mx-auto">
								{questionData.map((elem, index) => {
									return <InputField elem={elem} input={input} onInputChange={onInputChange} key={elem.id} />;
								})}
								<div>
									<div className="flex items-start">
										<div className="flex items-center h-5 mb-4">
											<input
												id="terms"
												aria-describedby="terms"
												type="checkbox"
												className="cursor-pointer w-4 h-4 border hover:text-purple-400 focus:text-purple-500 checked:bg-purple-500 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
												required
												onClick={function (event) {
													setIsChecked(!isChecked);
													// setDisabled(!disabled)
												}}
											/>
										</div>
										<div className="ml-3 text-sm">
											<div for="terms" className="font-medium text-gray-500 dark:text-gray-300">
												<span onClick={() => setIsOpen(true)} className="cursor-pointer font-medium text-purple-600 hover:underline dark:text-purple-500">
													개인정보 수집·이용
												</span>
												에 동의합니다
											</div>
										</div>
									</div>
									<button
										id="submitBtn"
										type="submit"
										onClick={onSubmit}
										// onClick={() => sendEmail()}
										disabled={isChecked ? false : true}
										className="disabled:bg-purple-200 w-full place-content-center cursor-pointer flex text-white bg-purple-500 hover:bg-purple-600 py-2.5 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
									>
										체험 계정 발급받기
									</button>
								</div>
								<PrivacyModal isOpen={isOpen} setIsOpen={setIsOpen} />
							</form>
						</div>
					</div>
				</section>
			) : (
				<section className="grid w-screen h-screen place-content-center">
					<div className="w-full bg-white flex flex-col space-y-4">
						<h1 className="text-center text-2xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white">체험 아이디 신청 완료</h1>
						<p className="text-center text-sm text-gray-500">
							확인 이메일을 보내드렸어요! <br /> 이메일이 보이지 않는다면 스팸함을 확인해주세요 🙂
						</p>
						<Link href="/" className="flex mx-auto items-center text-2xl font-semibold mb-4">
							<Image alt="타입리걸" src="/icon/typelegal.png" width={0} height={0} sizes="100vw" className="w-[140px]" />
						</Link>
					</div>
				</section>
			)}
		</>
	);
}

const InputField = ({ elem, input, onInputChange }) => {
	return (
		<div className="">
			<p className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">{elem.label}</p>
			{elem.subTitle && <p className="block mb-2 text-xs font-normal text-gray-400 dark:text-white">{elem.subTitle}</p>}
			<input
				type={elem.type}
				name={elem.name}
				placeholder={elem.placeholder}
				value={input[elem.name]}
				onChange={onInputChange}
				className="bg-gray-50 py-1.5 mt-1.5 placeholder:text-slate-400  border-gray-200 hover:border-purple-400 text-gray-700 text-sm rounded-md focus:ring-purple-600 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
				required={elem.required ? 'required' : ''}
			/>
			{/* {!errorFree && error[elem.name] && <span className="absolute mt-[0.2rem] inline-block text-[0.6rem] ml-[0.4rem]">{error[elem.name]}</span>} */}
		</div>
	);
};

async function registerMvp(data) {
	console.log('entered registerMvp');
	const apiUrlEndpoint = `https://conan.ai/_functions/registerMvp`;

	const body = JSON.stringify({
		// _id: data._id,
		data: data,
	});

	return fetch(apiUrlEndpoint, {
		method: 'post',
		body,
	})
		.then(response => {
			console.log('response', response);
			if (response.ok) {
				return response.json();
			}
			return Promise.reject('fetch to wix function has failed ' + response.status);
		})
		.catch(e => {
			console.log(`Error :  ${String(e)}`);
		});
}
