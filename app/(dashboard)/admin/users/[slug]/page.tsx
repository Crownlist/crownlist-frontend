import UserSlug from "@/components/Home/UserSlug"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async  function UserDetailsPage(props: PageProps) {
  
  const { slug } = await props.params
  console.log(slug)

 
  return (
   <>
   <UserSlug/>
   </>
  )
}

export function generateStaticParams() {
  return [{ slug: '0' }, { slug: '1' }, { slug: '2' }, { slug: '3' }]
}
