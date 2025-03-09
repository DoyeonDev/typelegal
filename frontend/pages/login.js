import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
// import LoginItem from '../components/login-item'

export default function Login() {
	const [loginError, setLoginError] = useState(false);
	const [disabled, setDisabled] = useState(false);
	useEffect(() => {
		async function getPageData() {
			localStorage.theme = 'light';
		}
		getPageData();
	}, []);

	const [input, setInput] = useState({
		userEmail: '',
		password: '',
	});

	const onInputChange = e => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const onSubmit = () => {
		// console.log('들어옴')
		// console.log(input)
		setDisabled(true);
		let loginInfo = { email: input.userEmail, password: input.password };
		loginAccount(loginInfo);
	};

	async function loginAccount(userInfo) {
		// console.log('entered loginAccount', userInfo)
		const apiUrlEndpoint = `https://conan.ai/_functions/loginMember/${userInfo.email}/${userInfo.password}`;
		const response = await fetch(apiUrlEndpoint);
		// console.log('response', response)

		if (response.status === 200) {
			const res = await response.json();
			const data = await res.items;
			// getMemberType(data._id)
			const memberInfo = { email: data.user_email, name: data.user_name, submittedSurvey: data.submittedSurvey ? true : false };
			console.log('memberInfo', memberInfo);
			sessionStorage.setItem('member_key', JSON.stringify(memberInfo));
			// window.location.reload()
			location.assign('/dashboard');
		} else if (response.status === 404) {
			setLoginError(true);
			setDisabled(false);
		}
	}

	// async function getMemberType(userId) {
	//   console.log('entered getMemberType', userId)
	//   const apiUrlEndpoint = `https://conan.ai/_functions/memberType/${userId}`
	//   const response = await fetch(apiUrlEndpoint)
	//   const res = await response.json()
	//   const data = await res.items
	//   console.log('data', data)
	// }
	function press(e) {
		if (e.keyCode == 13) {
			onSubmit(); //javascript에서는 13이 enter키를 의미함
		}
	}
	return (
		// <section className="bg-white dark:bg-gray-900 h-screen">
		// <LoginItem />
		// </section>
		<section className="bg-white dark:bg-gray-900">
			<Head>
				<title>타입리걸 | 로그인</title>
				<meta name="description" content="계약서 작성의 시작, 타입리걸 로그인하기" />
				<meta property="og:title" content="타입리걸 계정 로그인" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				{/* shadow */}
				<div className="w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<Link href="/" className="flex place-content-center items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
							<Image alt="타입리걸" src="/icon/typelegal.png" width={0} height={0} sizes="100vw" className="w-[160px] p-2" />
						</Link>
						<h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white">로그인</h1>
						<form className="space-y-8" action="#">
							<div>
								<label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									이메일
								</label>
								<input
									type="email"
									name="userEmail"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
									placeholder="name@company.com"
									value={input.userEmail}
									onChange={function (event) {
										onInputChange(event);
										setLoginError(false);
										// setDisabled(false)
									}}
									onKeyDown={press}
									required=""
								/>
							</div>
							<div>
								<label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									비밀번호
								</label>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									value={input.password}
									onChange={function (event) {
										onInputChange(event);
										setLoginError(false);
										// setDisabled(false)
									}}
									onKeyDown={press}
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
									required=""
								/>
							</div>
							{/* <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label for="remember" className="text-gray-500 dark:text-gray-300">
                      이메일 기억하기
                    </label>
                  </div>
                </div>
                <a href="/findpassword" className="text-sm font-medium text-purple-600 hover:underline dark:text-purple-500">
                  비밀번호를 잊으셨나요?
                </a>
              </div> */}
							<button
								id="loginBtn"
								type="button"
								onClick={onSubmit}
								disabled={disabled}
								className="w-full place-content-center cursor-pointer flex disabled:bg-purple-200 disabled:cursor-progress text-white bg-purple-500 hover:bg-purple-600 py-2.5 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
							>
								로그인
							</button>
							{/* <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ​계정이 없다면 바로 가입하세요!
                <Link href="/signup" className="ml-2 font-medium text-purple-600 hover:underline dark:text-purple-500">
                  무료 회원가입 하기
                </Link>
              </p> */}
						</form>
						{loginError && <p className="text-sm text-gray-500 text-center">이메일 혹은 비밀번호가 일치하지 않습니다</p>}
					</div>
				</div>
			</div>
		</section>
	);
}
