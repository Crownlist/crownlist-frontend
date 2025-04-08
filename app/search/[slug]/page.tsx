/* eslint-disable */
import Footer from "@/components/Footer"
import Header from "@/components/Header1"
import SearchCategory from "@/components/Home/SearchCategory"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function AssignJobPage(props: PageProps) {
  const { slug } = await props.params

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header hidden={false} />
      <div className="container mx-auto  py-6 max-md:px-5">
        <SearchCategory />
      </div>
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return [{ slug: '0' }, { slug: '1' }, { slug: '2' }, { slug: '3' }]
}
