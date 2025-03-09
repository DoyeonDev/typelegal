import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { post_downloadLog } from '/pages/api/logs/docDownload';
import { post_mvpUserInfo } from '/pages/api/update/mvpUserInfo';
import { post_mvpUserSurvey } from '/pages/api/insert/mvpUserSurvey';

import Rating from '@mui/material/Rating';

const SurveyModal = ({ isOpen, setIsOpen, setFormSubmitted, setExportBtnState, user, contract, contractId }) => {
	const [userInfo, setUserInfo] = useState('');
	const [surveyActive, setSurveyActive] = useState('');
	const [input, setInput] = useState({ response1: '', response2: '', response3: '' });
	const [rating, setRating] = useState({ rating1: 0, rating2: 0, rating3: 0, rating4: 0 });

	useEffect(() => {
		async function getPageData() {
			localStorage.theme = 'light';
			setSurveyActive(true);
			let member_value = JSON.parse(sessionStorage.getItem('member_key'));
			const apiUrlEndpoint = `https://conan.ai/_functions/mvpUserInfoAll/${member_value.email}`;

			const response = await fetch(apiUrlEndpoint);
			if (response.status === 200) {
				const res = await response.json();
				const data = await res.items;
				setUserInfo(data);
			} else if (response.status === 404) {
				// setLoginError(true)
				// setDisabled(false)
			}
		}
		getPageData();
	}, []);

	// useEffect(() => {
	//   console.log('userInfo', userInfo)
	// }, [userInfo])

	const ratingQuestions = [
		{ idx: 1, id: 'rating1', name: 'rating1', label: '•  전반적으로 서비스 이용이 만족스러우셨나요?', text1: '아쉬워요', text2: '좋았어요' },
		{ idx: 2, id: 'rating2', name: 'rating2', label: '•  계약에 대한 조건을 충분히 반영할 수 있었나요?', text1: '부족해요', text2: '충분해요' },
		{ idx: 3, id: 'rating3', name: 'rating3', label: '•  계약서를 얼마나 쉽게 작성할 수 있었나요?', text1: '어려워요', text2: '쉬웠어요' },
		{ idx: 4, id: 'rating4', name: 'rating4', label: '•  계약서 해설이 얼마나 도움이 되었는지 평가해 주세요', text1: '아쉬워요', text2: '유용해요' },
	];

	const onInputChange = e => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const onRatingChange = (e, value) => {
		const { name } = e.target;
		setRating(prev => ({
			...prev,
			[name]: value,
		}));
	};

	// useEffect(() => {
	//   console.log('rating', rating)
	//   console.log('input', input)
	// }, [rating, input])

	const onSubmit = () => {
		// console.log('들어옴')
		// console.log(input)

		let surveyInfo = { ...{ name: user.name, email: user.email }, ...input, ...rating }; // name, email, inputs, ratings merge

		if (surveyInfo.response1 !== '' && surveyInfo.response2 !== '' && surveyInfo.response3 !== '') {
			// console.log('surveyInfo', surveyInfo)

			setFormSubmitted(true); // Update formSubmitted state for form control
			sessionStorage.setItem('member_key', JSON.stringify({ ...user, ...{ submittedSurvey: true } })); // Update member session info

			post_mvpUserSurvey(surveyInfo); // Post user's survey data
			post_mvpUserInfo({ ...userInfo, ...{ submittedSurvey: true } }); // Update mvp_user's submittedSurvey status

			postDownloadLog();
			// submitAutoEmail()
			setExportBtnState(true);
			closeModal();
		}
	};

	const postDownloadLog = () => {
		let downloadLog = { userName: user.name, userEmail: user.email, category: contract.title, title: `${contract.category} 계약서`, contractId: contractId };
		post_downloadLog(downloadLog);
	};

	const submitAutoEmail = async e => {
		// e.preventDefault()
		// console.log('input', JSON.stringify(input))
		let notificationInfo = { userEmail: user.email, userName: user.name, eventType: '설문조사', eventAction: '제출' };

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

	function closeModal() {
		// remove previous value
		setInput({ response1: '', response2: '', response3: '' });
		setRating({ rating1: 0, rating2: 0, rating3: 0, rating4: 0 });
		setIsOpen(false);
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
				<div className="min-h-screen px-4 text-center">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-black/50" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block h-screen align-middle" aria-hidden="true">
						&#8203;
					</span>
					{/* <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"> */}
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className={`my-8 inline-block transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-sm transition-all ${surveyActive ? 'w-[720px]' : 'w-[420px]'}`}>
							<div className="flex flex-col w-full pb-8 pt-4 px-8">
								<div className="mb-2 flex justify-end w-full items-center rounded-full bg-white-100 text-black ">
									<div
										onClick={function (event) {
											setIsOpen(false);
											closeModal();
										}}
										className="cursor-pointer"
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7F7F7F" className="w-6 h-6">
											<path
												fillRule="evenodd"
												d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
								<div className="grid space-y-6">
									<div className="flex items-end">
										<p className="text-base font-bold text-center text-gray-600">디자이너님! 설문에 답변해주시면 정말 큰 도움이 돼요 🙏</p>
										<p className="text-sm font-normal text-gray-500 pl-4">최초 1회만 설문에 참여해주세요!</p>
									</div>

									<form className={`space-y-8 ${!surveyActive && 'hidden'}`}>
										<div>
											<label htmlFor="" for="response1" className="block mb-4 bg-gray-100 p-2 rounded text-sm font-semibold text-blue-600 dark:text-white">
												① 디자이너님의 계약서 작성 경험이 궁금해요 🤔
											</label>
											<div className="space-y-5">
												<div className="flex gap-4 text-sm items-center pl-5">
													<p className="text-gray-700 font-normal w-[330px]">• 프리랜서 업무를 위해 계약서를 작성한 적이 있나요?</p>
													<div className="flex gap-4 text-sm">
														<label className="cursor-pointer text-sm font-normal items-center text-gray-600 dark:text-gray-300">
															<input
																name="response1"
																onChange={onInputChange}
																type="radio"
																value="있음"
																className={`mb-1 cursor-pointer text-blue-500 bg-gray-100 border-gray-300 focus:ring-blue-400 dark:focus:ring-blue-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 w-4 h-4`}
																required
															/>
															&nbsp;&nbsp;네
														</label>
														<label className="cursor-pointer text-sm font-normal items-center text-gray-600 dark:text-gray-300">
															<input
																name="response1"
																onChange={onInputChange}
																type="radio"
																value="없음"
																className={`mb-1 cursor-pointer text-blue-500 bg-gray-100 border-gray-300 focus:ring-blue-400 dark:focus:ring-blue-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 w-4 h-4`}
															/>
															&nbsp;&nbsp;아니요
														</label>
													</div>
												</div>
												<div className="flex gap-4 text-sm items-center pl-5">
													<p className="text-gray-700 font-normal w-[330px]">• 일반적으로 계약서는 한 달에 몇 번 작성하시나요?</p>
													<div className="flex gap-2 text-sm items-center">
														<input
															type="text"
															name="response2"
															placeholder="00"
															value={input.response2}
															onChange={onInputChange}
															className="bg-gray-50 w-[60px] h-[24px] py-1.5 placeholder:text-slate-400 border-gray-200 hover:border-blue-400 text-gray-700 text-sm focus:ring-blue-600 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
															required
														/>
														<span>회</span>
													</div>
												</div>
											</div>
										</div>
										<div>
											<label htmlFor="" for="response2" className="block mb-4 text-sm bg-gray-100 p-2 rounded font-semibold text-blue-600 dark:text-white">
												② 타입리걸 사용 후기를 별점으로 남겨주세요 🤩
											</label>
											{/* </div> */}
											<div className="space-y-5">
												{ratingQuestions.map((elem, index) => {
													return <InputField elem={elem} key={elem.id} rating={rating} onRatingChange={onRatingChange} />;
												})}
											</div>
										</div>
										<div>
											<label htmlFor="" for="response3" className="block mb-4 bg-gray-100 p-2 rounded text-sm font-semibold text-blue-600 dark:text-white">
												③ 다음 업데이트에 필요한 계약서가 있으세요?
											</label>
											{/* <div>
                      <Rating
                          unratedColor="amber"
                          ratedColor="amber"
                          id="sample"
                          name="sample"
                          value={rating1}
                          // onChange={value => setRating1(value)}
                          // onClick={function (event) {
                          //   console.log(event.target)
                          // }}
                          onChange={function (event, value) {
                            console.log(event, value)
                          }}
                        />
                      </div> */}
											<input
												type="text"
												name="response3"
												placeholder={`"프리랜서 명함 디자인 업무를 할 때 필요한 000 계약서 추가해 주세요"`}
												value={input.response3}
												onChange={onInputChange}
												className={`bg-gray-50 border placeholder:text-[13px]] text-sm border-gray-300 text-gray-900 rounded-sm focus:ring-blue-400 focus:border-blue-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
													!surveyActive && 'pointer-events-none'
												}`}
												required
											/>
										</div>
										<button
											id="downloadBtn"
											type="submit"
											onClick={function (event) {
												{
													surveyActive === true && onSubmit();
												}
											}}
											className="disabled:bg-blue-200 disabled:cursor-progress w-full place-content-center cursor-pointer flex text-white bg-blue-500 hover:bg-blue-600 py-2.5 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
										>
											{surveyActive ? '의견 공유하고 문서 다운로드하기' : '문서 다운로드하기'}
										</button>
									</form>
								</div>
							</div>
							<div className="flex items-center"></div>
							{/* <div className="flex space-x-2 px-8 pb-6">
                <button onClick={() => setIsOpen(false)} className="flex w-full items-center justify-center space-x-1 rounded-md border border-blue-400 py-2 text-sm text-blue-600 shadow-xs hover:bg-gray-200">
                  <span>닫기</span>
                </button>
                <button
                  onClick={function (event) {
                    setExportBtnState(true)
                    setIsOpen(false)
                  }}
                  className="flex w-full items-center justify-center space-x-1 rounded-md bg-blue-500 py-2 text-sm text-white shadow-xs hover:bg-blue-600 gap-1"
                >
                  <span>지금은 문서만 받을게요</span>
                </button>
              </div> */}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};
const InputField = ({ elem, rating, onRatingChange }) => {
	return (
		<div className="flex items-center pl-5 gap-4">
			<p className="text-sm font-normal w-[330px]">{elem.label}</p>
			<div className="flex gap-6 text-sm text-gray-600 items-center ">
				<span className="text-gray-500 font-normal">{elem.text1}</span>
				<Rating
					name={elem.name}
					size="medium"
					defaultValue={2.5}
					precision={0.5}
					value={rating[elem.name]}
					sx={{ color: '#FBBF2C', borderColor: '#FBBF2C' }}
					onChange={(event, newValue) => {
						console.log('event', event.target.name);
						onRatingChange(event, newValue);
						// setValue(newValue)
					}}
					// emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
				/>
				<span className="text-gray-500 font-normal">{elem.text2}</span>
			</div>
		</div>
	);
};

export default SurveyModal;
