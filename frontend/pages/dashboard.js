import { useEffect, useState } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import DeleteModal from '../components/modals/DeleteModal';
import LoginModal from '../components/modals/LoginModal';
import Spinner from '/components/ui/Spinner';

export default function Dashboard() {
	const [dashboardData, setDashboardData] = useState([]);
	const [dashboardGroup, setDashboardGroup] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [maxIndex, setMaxIndex] = useState(0);
	const [loaded, isLoaded] = useState(false);
	const [currentMember, setCurrentMember] = useState('');
	const [loginModalOpen, setLoginModalOpen] = useState(false);

	// let dataExists

	useEffect(() => {
		async function getPageData() {
			localStorage.theme = 'light';
			if (sessionStorage.getItem('member_key')) {
				let member_value = JSON.parse(sessionStorage.getItem('member_key'));
				setCurrentMember(member_value);
				let query = member_value.email;
				// let query = '7fe5cbd8-549b-446a-9087-82e946a07017'
				//   let query = '98421622-e987-4eaa-a9d1-bfb5b61c4513'
				const apiUrlEndpoint = `https://conan.ai/_functions/memberDraftingData/${query}`; // memberDraftingData, memberData

				const response = await fetch(apiUrlEndpoint);
				const res = await response.json();
				const data = await res.items;
				console.log('response', response);
				console.log('res', res);
				console.log('data', data);
				const groupedData = _.chunk(data, 5);
				setCurrentIndex(0);
				setDashboardData(data);
				setMaxIndex(groupedData.length - 1);
				setDashboardGroup(groupedData);
				isLoaded(true);
			} else {
				setLoginModalOpen(true);
			}
			if (sessionStorage.getItem('item_key')) sessionStorage.removeItem('item_key'); // remove contract key session
		}
		getPageData();
	}, []);

	useEffect(() => {
		if (loaded === true) {
			if (dashboardData) {
				console.log('[MAIN HOOK] setDashboardData rendered', dashboardData);
			} else {
				console.log('no data');
			}
		}
	}, [dashboardData, loaded]);

	useEffect(() => {
		if (loaded === true) {
			console.log('dashboardGroup', dashboardGroup);
		}
	}, [loaded, dashboardGroup]);

	const deleteItemHandler = id => {
		// setDashboardData(_.chunk(dashboardData, 5))
		deleteContractData(id);
		let newState = [...dashboardData].map(obj => {
			if (obj._id === id) {
				// console.log('[syncOutputSection] entered deleteClause', obj.binding_question)
				return { ...obj, ...{ is_deleted: true } }; // 전체 조항은 다 없애고
			}
			return obj;
		});
		newState = newState.filter(x => !x.is_deleted === true);
		if (dashboardGroup[currentIndex].length === 1) {
			setCurrentIndex(currentIndex - 1);
			setMaxIndex(dashboardGroup.length - 2);
		}
		setDashboardData(newState);
		setDashboardGroup(_.chunk(newState, 5));
	};

	async function deleteContractData(_id) {
		console.log('entered deleteData (삭제하러 들어옴)');
		const apiUrlEndpoint = `https://conan.ai/_functions/deleteData`;
		let toUpdate = {
			_id: _id,
			is_deleted: true,
		};

		const body = JSON.stringify({
			// _id: data._id,
			data: toUpdate,
		});

		return fetch(apiUrlEndpoint, {
			method: 'post',
			body,
		})
			.then(response => {
				console.log('response', response);
				if (response.ok) {
					setSaveToastState(true);
					return response.json();
				}
				return Promise.reject('fetch to wix function has failed ' + response.status);
			})
			.catch(e => {
				console.log(`Error :  ${String(e)}`);
			});
	}

	const onClickHandler = e => {
		console.log('clicked - onClickHandler');
		const btnId = e.target.id;
		const type = e.target.name;
		console.log('btnId : ', e.target.id);
		console.log('currentIndex', currentIndex);
		console.log('maxIndex', maxIndex);

		if (btnId && type === 'paginationBtn') {
			if (btnId === 'btnNext' && currentIndex < maxIndex) {
				console.log('entered case 1');
				setCurrentIndex(currentIndex + 1);
			} else if (btnId === 'btnPrevious' && currentIndex > 0) {
				console.log('entered case 2');
				setCurrentIndex(currentIndex - 1);
			}
		}

		if (btnId && type === 'paginationNum') {
			// console.log('clicked', btnId)
			setCurrentIndex(parseInt(btnId));
		}
	};

	return (
		<>
			<div className="grid grid-cols-[240px_1fr]">
				<Head>
					<title>타입리걸</title>
					<meta name="description" content="계약서 작성의 시작, 타입리걸" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Sidebar data={currentMember} />
				<LoginModal loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />

				{loaded === true ? (
					<div className="flex flex-col w-full">
						{/* <DashboardNavBar />
              <div className="grid grid-cols-[1fr_360px] h-[calc(100vh-60px)]"> */}
						<div className="grid grid-cols-[1fr] h-screen">
							<div className={`flex flex-col h-full place-content-center space-y-8 2xl:space-y-[10vh] py-8 px-8 2xl:px-[6vw] mx-auto ${dashboardData && 'mx-0'}`}>
								{/* <div className="flex flex-col h-full place-content-center space-y-8 2xl:space-y-[10vh] py-8 px-8 2xl:px-[6vw]"> */}
								{/* mx-auto  */}
								{/* 중간패널 상단 */}
								<SelectContract dummies={dummies} dashboardData={dashboardData} key={uuidv4()} />
								{/* 중간패널 하단 */}
								{dashboardGroup.map((elem, index) => {
									if (currentIndex === index) {
										return <DashboardWrapper dataList={elem} currentIndex={currentIndex} maxIndex={maxIndex} onClickHandler={onClickHandler} deleteItemHandler={deleteItemHandler} key={uuidv4()} />;
									}
								})}
							</div>
							{/* 오른쪽 */}
						</div>
					</div>
				) : (
					<Spinner />
				)}
			</div>
		</>
	);
}

let dummies = [
	{ image: 'image/logo_design2.png', title: '로고 디자인', title2: '계약서', price: '$16.00', color: 'bg-[#FDE93A]', ready: true, url: '/draft/logo' },
	{ image: 'image/logo_design2.png', title: '인쇄 · 홍보물', title2: '디자인 계약서', price: '$17.00', color: 'bg-[#01BB73]', ready: true, url: '/draft/printing' },
	{ image: 'image/logo_design2.png', title: '패키지 디자인', title2: '계약서', price: '$18.00', color: 'bg-[#FEDBE8]', ready: true, url: '/draft/package' },
	{ image: 'image/logo_design2.png', title: '브랜드 디자인', title2: '계약서', price: '$18.00', color: 'bg-[#263889]', ready: true, url: '/draft/brand' },
	// { image: 'image/logo_design2.png', title: '브랜드 디자인', title2: '계약서', price: '$18.00', color: 'bg-[#263889]', ready: false },
];
function SelectContract({ dummies, dashboardData }) {
	return (
		<>
			<section className="px-4">
				<div className="flex items-center gap-4">
					{/* <Image alt="계약서 작성하기" src="/icon/pen.svg" width={0} height={0} sizes="100vw" className="w-8 h-8" /> */}
					<p className="text-xl font-semibold text-black ">{dashboardData && '계약서 작성하기'}</p>
				</div>
				<div className="text-gray-600 body-font ">
					<div className="flex gap-12 mt-4 mb-4">
						{dummies.map(dummy => {
							return (
								<div className="w-fit" key={uuidv4()}>
									<div className={`relative h-[150px] border round rounded-sm`}>
										{dummy.ready ? (
											<>
												<Link className="z-100" href={dummy.url}>
													{/* <Image alt="디자인 프리랜서 계약서" src="/image/template.png" className="w-full h-full" layout="fill" objectFit="contain" /> */}
													<Image alt={`${dummy.title} ${dummy.title2}`} src="/image/template.png" width={0} height={0} sizes="100vw" className="w-full h-full" />
												</Link>

												{!dummy.title2 ? (
													<p className="absolute top-0 mt-12 bottom-1/2 left-0 right-0 m-auto text-center font-extrabold">{dummy.title}</p>
												) : (
													<p className="absolute top-0 mt-9 bottom-1/2 left-0 right-0 m-auto text-center font-extrabold">
														<span className="">{dummy.title}</span>
														<br />
														{dummy.title2}
													</p>
												)}
												<Link className="z-100" href={dummy.url}>
													<Image alt="타입리걸" src="/icon/typelegal.png" width={0} height={0} sizes="100vw" className="absolute inset-x-0 bottom-0 w-[80px] mb-3 mx-auto" />
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="opacity-0 w-10 h-10 center-icon z-0">
														<path
															fillRule="evenodd"
															d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
															clipRule="evenodd"
														/>
													</svg>

													{/* window.location(url); */}
													<div className="z-1 absolute w-full h-full bg-black opacity-0 hover:opacity-70 flex items-center cursor-pointer center-icon">
														<div className="bg-transparent mx-auto">
															<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" class="w-10 h-10">
																<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														</div>
													</div>
												</Link>
											</>
										) : (
											<div className="absolute w-full h-full bg-black center-icon opacity-40 flex items-center">
												<div className="bg-transparent mx-auto">
													<p className="text-white">Coming Soon</p>
												</div>
											</div>
										)}
									</div>

									{/* <div className="mt-4">
                    <h2 className="text-gray-900 title-font text-sm font-semibold">
                      {dummy.title} {dummy.title2}
                    </h2>
                  </div> */}
								</div>
							);
						})}
					</div>
				</div>
			</section>
		</>
	);
}

function DashboardWrapper({ dataList, currentIndex, maxIndex, onClickHandler, deleteItemHandler }) {
	// console.log('dataList', dataList)
	console.log('dataList', dataList);
	return (
		<>
			<section className="w-full">
				<div className="flex flex-col h-[410px] justify-between px-4">
					<div>
						<div className="flex items-center gap-x-3">
							<h2 className="text-xl font-semibold text-gray-800 dark:text-white">최근 활동</h2>
							{/* <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">총 100개 문서</span> */}
						</div>
						<div className="flex flex-col mt-4">
							<table className="table-fixed w-[100%] h-full divide-y divide-gray-200 dark:divide-gray-700">
								<DashboardHeader />
								{dataList.map((elem, index) => {
									return <DashboardBody dataItem={elem} key={uuidv4()} deleteItemHandler={deleteItemHandler} />;
									// }
								})}
							</table>
						</div>
					</div>
					<DashboardFooter onClickHandler={onClickHandler} currentIndex={currentIndex} maxIndex={maxIndex} />
				</div>
			</section>
		</>
	);
}

const DashboardBody = ({ dataItem, deleteItemHandler }) => {
	const [isOpen, setIsOpen] = useState(false);
	// console.log('dataItem', dataItem)

	const handleSession = e => {
		console.log('entered handleSession');
		sessionStorage.setItem('item_key', e.target.id);
		let item_value = sessionStorage.getItem('item_key');
		console.log('item_value', item_value);
	};
	let tableStyle = '';
	// console.log('dataItem', dataItem)
	return (
		<>
			{/* even:bg-slate-50 */}
			<tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
				<tr className="hover:bg-slate-50">
					<td className="w-[18%] px-2 py-2.5 text-sm font-medium text-gray-700">
						<ContractStageElem stage={dataItem.status} />
					</td>
					<td className="truncate w-[26%] px-4 py-2.5 text-sm text-gray-500 dark:text-gray-300">{dataItem.title}</td>
					<td className="truncate w-[26%] px-6 py-2.5 text-sm text-gray-500 dark:text-gray-300">{dataItem.typeEn}</td>
					<td className="truncate w-[16%] px-4 py-2.5 text-sm text-gray-500 dark:text-gray-300">{new Date(dataItem._updatedDate).toLocaleDateString()}</td>
					<td className="truncate w-[14%] px-4 py-2.5 text-sm">
						<div className="flex items-center gap-x-6">
							<div id={dataItem._id} onClick={e => setIsOpen(true)} className="cursor-pointer text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="pointer-events-none w-5 h-5">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
									/>
								</svg>
							</div>
							<DeleteModal isOpen={isOpen} setIsOpen={setIsOpen} deleteItemHandler={deleteItemHandler} id={dataItem._id} />

							<Link
								// href="/template/package"
								// href={`/template/${dataItem.query}/?_id=${dataItem._id}`}

								href={dataItem.query ? `/draft/${dataItem.query}/?_id=${dataItem._id}` : `/write/?_id=${dataItem._id}`}
								id={dataItem._id}
								onClick={handleSession}
								className="cursor-pointer text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="pointer-events-none w-5 h-5">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
									/>
								</svg>
							</Link>
						</div>
					</td>
				</tr>
			</tbody>
		</>
	);
};

const DashboardHeader = () => {
	return (
		<>
			<thead className="bg-white dark:bg-gray-800">
				<tr>
					<th scope="col" className="w-[18%] pl-6 pr-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
						상태
					</th>
					<th scope="col" className="w-[26%] px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
						문서 이름
					</th>
					<th scope="col" className="w-[26%] px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<span>계약 분류</span>
					</th>
					<th scope="col" className="w-[16%] px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
						생성일
					</th>
					<th scope="col" className="w-[14%] relative px-4 py-3.5 text-gray-500 dark:text-gray-400">
						<span className="sr-only">Edit</span>
					</th>
				</tr>
			</thead>
		</>
	);
};

const DashboardFooter = ({ onClickHandler, currentIndex, maxIndex }) => {
	return (
		<>
			<div className="flex items-center justify-between mt-6">
				<button
					id="btnPrevious"
					name="paginationBtn"
					onClick={onClickHandler}
					className="w-[130px] place-content-center cursor-pointer flex py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="pointer-events-none w-5 h-5 rtl:-scale-x-100">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
					</svg>
					이전
				</button>
				<div className="items-center lg:flex gap-x-3">
					<FooterPagination currentIndex={currentIndex} maxIndex={maxIndex} onClickHandler={onClickHandler} />
				</div>

				<button
					id="btnNext"
					name="paginationBtn"
					onClick={onClickHandler}
					className="w-[130px] place-content-center cursor-pointer flex py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
				>
					다음
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="pointer-events-none w-5 h-5 rtl:-scale-x-100">
						<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
					</svg>
				</button>
			</div>
		</>
	);
};

const FooterPagination = ({ currentIndex, maxIndex, onClickHandler }) => {
	console.log('maxIndex', maxIndex);
	console.log('currentIndex123', currentIndex);

	const pagination = [];
	for (let i = 0; i <= maxIndex; i++) {
		if (i === currentIndex) {
			pagination.push(
				<Link href="#" id={i} name="paginationNum" onClick={onClickHandler} className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60" key={uuidv4()}>
					{i + 1}
				</Link>
			);
		} else {
			pagination.push(
				<Link href="#" id={i} name="paginationNum" onClick={onClickHandler} className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100" key={uuidv4()}>
					{i + 1}
				</Link>
			);
		}
	}
	return <>{pagination}</>;
};

function ContractStageElem({ stage }) {
	// console.log('stage', stage)
	let color = {
		stage1: ['작성중', `bg-[#9898A9]`, `bg-[#F7F7FC]`],
		stage2: ['작성완료', `bg-[#80CBFF]`, `bg-[#F3FAFF]`],
		stage3: ['검토중', `bg-[#FFCE00]`, `bg-[#FCF7E5]`],
		stage4: ['서명완료', `bg-[#FE8C8C]`, `bg-[#FFF2F3]`],
		stage5: ['서명완료', `bg-[#1DDC77]`, `bg-[#E5F8F1]`],
		'': ['작성중', `bg-[#9898A9]`, `bg-[#F7F7FC]`],
	};
	let colors = color[stage];
	let bgColor = colors[2];
	let textColor = colors[1];
	let textVal = colors[0];

	return (
		<>
			<div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${bgColor} dark:bg-gray-800 `}>
				<span className={`h-1.5 w-1.5 rounded-full ${textColor}`}></span>
				<h2 className={`text-sm font-normal text-gray-600`}>{textVal}</h2>
			</div>
		</>
	);
}
// fill, contain, cover, none, scale-down
function Sidebar({ data }) {
	return (
		<>
			<aside className="flex flex-col w-[240px] h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
				<Link href="/" className="flex pl-4">
					<Image alt="타입리걸" src="/icon/typelegal.png" width={0} height={0} sizes="100vw" style={{ width: '150px', height: 'auto' }} />
				</Link>
				{/* <div className="relative mt-6">
					<span className="absolute inset-y-0 left-0 flex items-center pl-3">
						<svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
							<path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
						</svg>
					</span>
					<input
						type="text"
						className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
						placeholder="Search"
					/>
				</div> */}
				<div className="flex flex-col justify-between flex-1 mt-6">
					<nav>
						<Link href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200">
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="mx-4 font-medium">내 문서</span>
						</Link>
					</nav>
				</div>
				{/* 측면 하판 */}
				<div className="grid space-y-5 pl-2">
					<div className="font-bold">문제가 발생했나요?</div>
					<div className="w-8 h-1 bg-gray-300"></div>
					<div className="text-sm font-medium text-gray-500 space-y-0.5">
						<div>문의가능 : M-F, 09:00-19:00</div>
						<div>이메일 : team@typelegal.io</div>
					</div>
				</div>
			</aside>
		</>
	);
}
