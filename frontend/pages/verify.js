import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EMAIL_REGEX_VALIDATION, PASSWORD_REGEX_VALIDATION, PHONE_REGEX_VALIDATION } from '../lib/lib';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
// import { SENDGRID_API_KEY } from '../config'

export default function Verify() {
	const searchParams = useSearchParams();
	const _id = searchParams.get('_id');
	const [verified, setVerified] = useState(false);
	const [registered, setRegistered] = useState(true);
	const [disabled, setDisabled] = useState(true);
	const [info, setInfo] = useState([]);
	const [inputState, setInputState] = useState({ password: false, confirmPassword: false });
	const [input, setInput] = useState({ password: '', confirmPassword: '' });
	const [error, setError] = useState({ password: '', confirmPassword: '' });
	//   const id = searchParams.get('_id')
	useEffect(() => {
		async function getPageData() {
			if (_id) {
				verifyUser(_id);
			}
		}
		getPageData();
	}, [_id]);

	useEffect(() => {
		// console.log('inputState', inputState)
		if (inputState.password && inputState.confirmPassword) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [inputState]);

	async function verifyUser(userId) {
		// console.log('entered verifyUser', userId)
		const apiUrlEndpoint = `https://conan.ai/_functions/verifyUser/${userId}`;
		const response = await fetch(apiUrlEndpoint);
		// console.log('response', response)

		if (response.status === 200) {
			const res = await response.json();
			const data = await res.items;
			console.log('data', data);
			setVerified(true);
			if (data[0].registered) {
				location.assign('/login');
				setRegistered(true);
			} else {
				setRegistered(false);
			}
			setInfo(data[0]);
			// getMemberType(data._id)
			//   const memberInfo = { id: data._id, email: data.loginEmail, name: data.name, status: 'logged-in' }
			// console.log('memberInfo', memberInfo.id)
			//   sessionStorage.setItem('member_key', JSON.stringify(memberInfo))
			// window.location.reload()
			//   location.assign('/dashboard')
		} else if (response.status === 404) {
			//   setLoginError(true)
			setDisabled(true);
		}
	}

	async function registerAccount(data) {
		console.log('entered registerAccount');
		const apiUrlEndpoint = `https://conan.ai/_functions/registerAccount`;

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
				if (response.created) {
					//   location.assign('/login')
					return response.json();
				}
				return Promise.reject('fetch to wix function has failed ' + response.status);
			})
			.catch(e => {
				console.log(`Error :  ${String(e)}`);
			});
	}

	async function updateRegisteredStatus(data) {
		console.log('entered registerAccount');
		const apiUrlEndpoint = `https://conan.ai/_functions/updateMvp`;

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

	const onInputChange = e => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value,
		}));
		validateInput(e);
	};

	const validateInput = e => {
		let { name, value } = e.target;
		setError(prev => {
			const stateObj = { ...prev, [name]: '' };

			switch (name) {
				case 'password':
					if (!value) {
						stateObj[name] = '비밀번호를 입력해주세요.';
						setInputState(prev => ({
							...prev,
							['password']: false,
						}));
					} else if (!PASSWORD_REGEX_VALIDATION.test(value)) {
						stateObj[name] = '영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.';
						setInputState(prev => ({
							...prev,
							['password']: false,
						}));
					} else if (PASSWORD_REGEX_VALIDATION.test(value)) {
						setInputState(prev => ({
							...prev,
							['password']: true,
						}));
					}
					break;

				case 'confirmPassword':
					if (!value) {
						stateObj[name] = '비밀번호를 확인해주세요.';
						setInputState(prev => ({
							...prev,
							['confirmPassword']: false,
						}));
					} else if (input.password && value !== input.password) {
						stateObj[name] = '비밀번호가 일치하지 않습니다.';
						setInputState(prev => ({
							...prev,
							['confirmPassword']: false,
						}));
					} else if (input.password && value === input.password) {
						setInputState(prev => ({
							...prev,
							['confirmPassword']: true,
						}));
					}
					break;

				default:
					break;
			}
			return stateObj;
		});
	};

	const submitAutoEmail = async e => {
		// e.preventDefault()
		// console.log('input', JSON.stringify(input))
		let notificationInfo = { userEmail: info.user_email, userName: info.user_name, eventType: '체험아이디', eventAction: '활성화' };

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
		// console.log('들어옴')
		// console.log(input)

		let registerInfo = { email: info.user_email, pw: input.password, name: info.user_name, phone: info.user_phone };
		registerAccount(registerInfo);

		let updateInfo = { ...info, ...{ registered: true } };
		// if (info.user_career && info.user_career !== '') {
		//   updateInfo = { _id: info._id, user_email: info.user_email, user_name: info.user_name, user_phone: info.user_phone, user_career: info.user_career, registered: true, activation_key: info.activation_key }
		// } else {
		//   updateInfo = { _id: info._id, user_email: info.user_email, user_name: info.user_name, user_phone: info.user_phone, registered: true, activation_key: info.activation_key }
		// }
		updateRegisteredStatus(updateInfo);
		submitAutoEmail();
		location.assign('/login');
	};

	function press(e) {
		if (e.keyCode == 13) {
			onSubmit(); //javascript에서는 13이 enter키를 의미함
		}
	}

	return (
		<>
			<Head>
				<title>타입리걸</title>
				<meta name="description" content="계약서 작성의 시작, 타입리걸" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{verified && !registered ? (
				<section className="grid w-screen h-screen place-content-center">
					<div className="w-full bg-white flex flex-col space-y-4">
						<Link href="/" className="flex mx-auto items-center text-2xl font-semibold mb-4">
							<Image alt="타입리걸" src="/icon/typelegal.png" width={0} height={0} sizes="100vw" className="w-[140px]" />
						</Link>
						<h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white">비밀번호를 설정하고 가입을 마무리해주세요!</h1>
						{/* <p className="text-center text-sm text-gray-500">
              타입리걸 베타 서비스 신청 완료 <br /> 이메일로 테스트 아이디를 보내드릴게요!
            </p> */}
						<div className="w-[560px] p-6 space-y-10 mx-auto ">
							<div>
								<label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									비밀번호
								</label>
								<input
									type="password"
									name="password"
									placeholder="••••••••"
									value={input.password}
									onChange={onInputChange}
									className="bg-gray-50 border-gray-200 hover:border-purple-400 text-gray-700 text-sm rounded-md focus:ring-purple-600 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
									required
								/>
								{error.password && <span className="text-gray-500 inline-block text-[0.8rem] ml-[0.4rem]">영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.</span>}
							</div>
							<div>
								<label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									비밀번호 확인
								</label>
								<input
									type="password"
									name="confirmPassword"
									placeholder="••••••••"
									value={input.confirmPassword}
									onChange={onInputChange}
									onBlur={validateInput}
									className="bg-gray-50 border-gray-200 hover:border-purple-400 text-gray-700 text-sm rounded-md focus:ring-purple-600 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
									required
									onKeyDown={press}
								/>
								{error.confirmPassword && <span className="text-gray-500 inline-block text-[0.8rem] ml-[0.4rem]">{error.confirmPassword}</span>}
							</div>
							<div>
								<button
									id="submitBtn"
									type="submit"
									onClick={onSubmit}
									// onClick={() => sendEmail()}
									disabled={disabled}
									className="disabled:bg-purple-200 w-full place-content-center cursor-pointer flex text-white bg-purple-500 hover:bg-purple-600 py-2.5 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
								>
									비밀번호 저장
								</button>
							</div>
						</div>
						{/* <span>
          <p className="text-center text-gray-400">타입리걸은 베타랑 변호사와 젊은 기획자들이 만든 서비스입니다</p>
          
        </span> */}
					</div>
				</section>
			) : (
				<div className="flex h-screen place-content-center">
					<Spinner registered={registered} />
				</div>
			)}
		</>
	);
}

const Spinner = ({ registered }) => {
	return (
		<>
			<div className="grid h-[100%]">
				<div className="grid place-content-center items-center">
					<div className="mx-auto" role="status">
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
					</div>
					{!registered && <div className="mx-auto text-sm text-gray-500 mt-4">계정을 활성화하는 중입니다.</div>}
				</div>
			</div>
		</>
	);
};
