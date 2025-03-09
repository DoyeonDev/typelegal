import { useState } from 'react';
import { EMAIL_REGEX_VALIDATION, PASSWORD_REGEX_VALIDATION, PHONE_REGEX_VALIDATION } from '../lib/lib';
// import React from 'react'
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function SignUp() {
	const [input, setInput] = useState({
		userName: '',
		userEmail: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState({
		userName: '',
		userEmail: '',
		password: '',
		confirmPassword: '',
	});

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
				case 'userName':
					if (!value) {
						stateObj[name] = '이름을 입력해주세요.';
					}
					break;
				case 'userEmail':
					if (!value) {
						stateObj[name] = '이메일을 입력해주세요.';
					} else if (!EMAIL_REGEX_VALIDATION.test(value)) {
						stateObj[name] = '이메일 형식이 맞지 않습니다. 다시 한번 확인해 주세요.';
					}
					break;
				case 'password':
					if (!value) {
						stateObj[name] = '비밀번호를 입력해주세요.';
					} else if (!PASSWORD_REGEX_VALIDATION.test(value)) {
						stateObj[name] = '영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.';
					}
					break;

				case 'confirmPassword':
					if (!value) {
						stateObj[name] = '비밀번호를 확인해주세요.';
					} else if (input.password && value !== input.password) {
						stateObj[name] = '비밀번호가 일치하지 않습니다.';
					}
					//   else if (input.password && value === input.password) {
					//     stateObj[name] = '일치'
					//   }
					break;

				default:
					break;
			}

			return stateObj;
		});
	};

	const onSubmit = () => {
		console.log('들어옴');
		console.log(input);
		let registerInfo = { email: input.userEmail, pw: input.password, name: input.userName };
		registerAccount(registerInfo);
		// registerAccount(data)
	};

	async function registerAccount(data) {
		console.log('entered saveContractData');
		const apiUrlEndpoint = `https://conan.ai/_functions/signUp`;

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

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<Head>
				<title>타입리걸</title>
				<meta name="description" content="계약서 작성의 시작, 타입리걸" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<Link href="/" className="flex place-content-center items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
							<Image alt="타입리걸" src="/icon/typelegal.png" width={0} height={0} sizes="100vw" className="w-[160px] p-2" />
						</Link>
						<h1 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white text-center">타입리걸 계정 만들기</h1>
						<form className="space-y-4 md:space-y-6">
							<div>
								<label htmlFor="" for="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									이름
								</label>
								<input
									type="text"
									name="userName"
									placeholder="이름을 입력해주세요"
									value={input.userName}
									onChange={onInputChange}
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
								/>
								{error.userName && <span className="inline-block text-[0.6rem] ml-[0.4rem]">{error.userName}</span>}
							</div>
							<div>
								<label htmlFor="" for="userEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									이메일
								</label>
								<input
									type="email"
									name="userEmail"
									placeholder="name@company.com"
									value={input.userEmail}
									onChange={onInputChange}
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
									required=""
								/>
								{error.userEmail && <span className="inline-block text-[0.6rem] ml-[0.4rem]">이메일을 입력해주세요.</span>}
							</div>
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
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
									required=""
								/>
								{error.password && <span className="inline-block text-[0.6rem] ml-[0.4rem]">영문, 숫자, 특수문자 혼용 8자 이상 입력해주세요.</span>}
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
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
									required=""
								/>
								{error.confirmPassword && <span className="inline-block text-[0.6rem] ml-[0.4rem]">{error.confirmPassword}</span>}
							</div>
							<div className="flex items-start">
								<div className="flex items-center h-5">
									<input
										id="terms"
										aria-describedby="terms"
										type="checkbox"
										className="cursor-pointer w-4 h-4 border checked:bg-purple-500 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
										required=""
									/>
								</div>
								<div className="ml-3 text-sm">
									<div for="terms" className="font-medium text-gray-500 dark:text-gray-300">
										<Link href="/policy/terms" target="_blank" className="font-medium text-purple-600 hover:underline dark:text-purple-500">
											서비스 이용약관
										</Link>
										에 동의합니다
									</div>
								</div>
							</div>
							<input
								// type="submit"
								onClick={onSubmit}
								className="w-full cursor-pointer text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
								value="가입하기"
							/>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
								이미 계정이 있으신가요?
								<Link href="/login" className="ml-2 font-medium text-purple-600 hover:underline dark:text-purple-500">
									로그인 하기
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
