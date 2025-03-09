import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async ctx => {
  const response = await fetch('https://conan.ai/_functions/getAllContractInfo')
  const res = await response.json()
  const contracts = await res.items
  console.log('ctx', ctx)

  // const newsSitemaps = contracts.map(contract => ({
  //   loc: `https://www.typelegal.io/contracts/${contract.cId}`,
  //   lastmod: new Date().toISOString(),
  // }))

  // const fields = [...newsSitemaps]

  // if (contracts) {
  //   const fields = contracts.map(contract => ({
  //     loc: `https://www.typelegal.io/contracts/${contract.cId}`,
  //     lastmod: new Date().toISOString(),
  //   }))

  //   if (Array.isArray(fields)) {
  //     return getServerSideSitemap(ctx, fields)
  //   }
  // }

  const fields = contracts.map(contract => ({
    loc: `https://www.typelegal.io/contracts/${contract.cId}`,
    lastmod: new Date().toISOString(),
  }))
  console.log('fields', fields)

  // const fields = [
  //   {
  //     loc: `https://www.typelegal.io/contracts/8`,
  //     lastmod: new Date().toISOString(),
  //   },
  // ]

  return await getServerSideSitemap(ctx, fields)
}

export default function Site() {}
