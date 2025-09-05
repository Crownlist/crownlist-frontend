// /* eslint-disable */
// /* eslint-disable */
import Image from 'next/image'

// const data = [
//     {
//         img: '/ostory.svg', title: 'Our Story', content: "  Founded in 2025, crownlist originated from a student's vision to assist fellow students in finding nearby hostels effortlessly from home. After a week of research, this idea evolved into a  platform that helps individuals find and purchase a wide range of products with ease, organized by categories"
//     },
//     { img: '/omission.svg', title: 'Our Mission', content: "Our mission at CROWNLIST is to connect buyers and sellers in a safe and user-friendly environment. We empower sellers by providing a platform to reach a wider audience and increase their sales. Simultaneously, we strive to help buyers effortlessly discover diverse sellers and find the products they desire at various price points, fostering a thriving and accessible marketplace for all." },
//     {
//         img: '/ovision.svg', title: 'Our Vision', content: "Our vision for CROWNLIST is to become the leading online marketplace known for its safety, user-friendliness, and comprehensive range of products. We aim to continuously expand our categories and innovative features, like our product request system, ensuring there's something for everyone. Ultimately, we aspire to create a seamless and empowering e-commerce experience that benefits both buyers and sellers alike."
//     }
// ]


const data = [
  {
    img: "/ostory.svg",
    title: "Our Story",
    content:
      "CROWNLIST began in 2025 as a simple idea from a student who wanted to help others find nearby hostels without leaving home. After just a week of research, that idea grew into something bigger—a platform where anyone can easily discover and buy all kinds of products, neatly organized by category.",
  },

  {
    img: "/omission.svg",
    title: "Our Mission",
    content:
      "We’re here to make buying and selling easy, safe, and enjoyable for everyone. Our platform helps sellers reach more people and grow their business, while giving buyers a smooth way to find what they need—from everyday items to hidden gems—at prices that work for them. We’re building a trusted, vibrant marketplace where anyone can post, browse, and connect with confidence.",
  },
  {
    img: "/ovision.svg",
    title: "Our Vision",
    content:
      "Our vision for CROWNLIST is to become the leading online marketplace known for its safety, user-friendliness, and comprehensive range of products. We aim to continuously expand our categories and innovative features, like our product request system, ensuring there's something for everyone. Ultimately, we aspire to create a seamless and empowering e-commerce experience that benefits both buyers and sellers alike.",
  },
];

// const coreValues = [
//     {
//         img: '/medal.svg',
//         title: 'Curated excellence',
//         content: 'We believe users deserve the best. Every listing is carefully selected to meet high standards of value and reliability'
//     },
//     {
//         img: '/emp.svg',
//         title: 'Empowerment through choice',
//         content: 'We empower our community by giving them the tools and knowledge to make confident, informed decisions',
//         mid: true
//     },
//     {
//         img: '/security.svg',
//         title: 'Integrity always',
//         content: 'We hold ourselves accountable to the highest ethical standards because reputation is earned, not given'
//     }
// ]

const AboutUs = () => {
    return (
        <div className='flex flex-col w-full  '>
            <div className='bg-[#1F058F]'>
                <div className='flex items-center align-middle justify-center p-4 text-white  py-8 container '>
                    <div className='flex flex-col items-center justify-center align-middle text-center gap-3'>
                        <div className='flex max-sm:text-[#52a9ff]'>
                            About Us
                        </div>
                        <div className='flex font-semibold md:text-2xl  '>
                            Welcome to CROWNLIST : Where Buying and Selling is Made Simple!
                        </div>
                        <p className='flex text-center align-middle font-light  text-sm  lg:px-45 px-1'>
                            Welcome to CROWNLIST, your trusted marketplace connecting buyers and sellers in a secure and intuitive online space. Founded in 2025, we are dedicated to empowering both sides of the transaction – enabling sellers to expand their reach and helping buyers discover a diverse range of products at competitive prices. From our beginnings as  student&apos;s solution to finding local housing, we&apos;ve grown into a platform committed to simplifying commerce for everyone.
                        </p>
                    </div>
                </div>
            </div>
            {/* second slide of the page */}
            <div className='flex flex-col gap-3 items-center justify-center container'>
                {/* <div className='md:hidden flex flex-col gap-2 items-center justify-center p-3'>
                    <div className='flex  max-sm:text-[#00982B] px-1 '>
                        About Us
                    </div>
                    <div className='flex align-middle font-light text-sm'>
                        We are a team of highly dedicated professionals of high ethical values. FixorsHub was birthed as an intervention to the erosion of the competencies, values, and ethics mostly rampant in the informal services sector. We help customers meet with an array of competent and customer centric service providers which take the burden of poor services and under-hand dealings off the shoulders of the customers.
                    </div>
                </div> */}

                <div className='md:hidden flex flex-col gap-7 items-center justify-center p-4  '>
                    {data.map((data) => (
                        <div className='flex flex-col gap-1 w-full justify-center align-middle border border-solid border-x-[#14141433] rounded-t-3xl rounded-b-2xl ' key={data.title}
                        >
                            <div className=' '>
                                <Image
                                    src={data.img}
                                    alt={data.title}
                                    height={900}
                                    width={700}
                                    className='w-full rounded-t-3xl'
                                />
                            </div>
                            <div className='flex font-semibold  px-2'>
                                {data.title}
                            </div>
                            <div className='flex font-light  p-2 '>
                                {data.content}
                            </div>
                        </div>
                    ))}
                </div>
                {/* for desktop view */}
                <div className='hidden md:flex flex-col gap-7 items-center justify-between p-10 w-full align-middle  '>
                    {/* first content */}
                    <div className='flex flex-row-reverse  max-w-6xl bg-[#ededed] w-full justify-between rounded-tr-3xl rounded-br-3xl '>
                        <div className=' flex h-[100%] align-middle justify-center items-center '>
                            <Image
                                src={'/ostory.svg'}
                                alt={'Our Story'}
                                height={250}
                                width={290}
                                className='w-full  max-h-[305px] 
                                object-cover
                                rounded-tr-3xl rounded-br-3xl'
                            />
                        </div>
                        <div className=' flex flex-col gap-3 flex-1 justify-center p-5
                        '>
                            <div className='flex font-semibold  px-2 text-[#2B2B2B]'>
                                Our Story
                            </div>
                            <div className='flex font-light  p-2 '>
                                 {data[0].content}
                            </div>
                        </div>
                    </div>
                    {/* second contents */}
                    <div className='flex flex-row max-w-6xl  bg-[#ededed] w-full justify-between rounded-tl-3xl rounded-bl-3xl'>
                        <div className=' flex h-[100%] align-middle justify-center items-center '>
                            <Image
                                src={'/omission.svg'}
                                alt={'Our Mission'}
                                height={250}
                                width={290}
                                className='w-full  max-h-[305px] 
                                object-cover
                                rounded-tl-3xl rounded-bl-3xl'
                            />
                        </div>
                        <div className=' flex flex-col gap-3 flex-1 justify-center p-5
                        '>
                            <div className='flex font-semibold  px-2 text-[#2B2B2B]'>
                                Our Mission
                            </div>
                            <div className='flex font-light  p-2 w-full'>
                                {data[1].content}
                            </div>
                        </div>
                    </div>
                    {/* third content */}
                    <div className='flex flex-row-reverse max-w-6xl bg-[#ededed] w-full justify-between rounded-tr-3xl rounded-br-3xl'>
                        <div className=' flex h-[100%] align-middle justify-center items-center '>
                            <Image
                                src={'/ovision.svg'}
                                alt={'Our Vision'}
                                height={250}
                                width={290}
                                className='w-full  max-h-[335px] 
                                object-cover
                                rounded-tr-3xl rounded-br-3xl'
                            />
                        </div>
                        <div className=' flex flex-col gap-3 flex-1 justify-center p-5
                        '>
                            <div className='flex font-semibold  px-2 text-[#2B2B2B]'>
                                Our Vision
                            </div>
                            <div className='flex font-light  p-2 '>
                               {data[2].content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs


































// import Image from 'next/image'

// const data = [
//     { img: '/miss1.png', title: 'Our Mission', content: "To make discovery simple, trusted, and rewarding by connecting people with the best services, brands, and experiences empowering them to make confident choices and celebrate every success" },
//     {
//         img: '/viss1.png', title: 'Our Vision', content: "To become the world’s most trusted platform for curated discovery, where every connection leads to greater confidence, meaningful experiences, and lasting value"
//     }
// ]
// const coreValues = [
//     {
//         img: '/medal.svg',
//         title: 'Curated excellence',
//         content: 'We believe users deserve the best. Every listing is carefully selected to meet high standards of value and reliability'
//     },
//     {
//         img: '/emp.svg',
//         title: 'Empowerment through choice',
//         content: 'We empower our community by giving them the tools and knowledge to make confident, informed decisions',
//         mid: true
//     },
//     {
//         img: '/security.svg',
//         title: 'Integrity always',
//         content: 'We hold ourselves accountable to the highest ethical standards because reputation is earned, not given'
//     }
// ]

// const AboutUs = () => {
//     return (
//         <div className='flex flex-col w-full container '>
//             <div className=''>
//                 <div className='flex items-center align-middle justify-center p-4  py-8 container '>
//                     <div className='flex flex-col items-center justify-center align-middle text-center gap-3'>
//                         <div className='flex bg-[#DBD2FE] text-[#1F058F] text-semibold rounded-full px-3'>
//                             About Us
//                         </div>
//                         <div className='flex font-semibold md:text-4xl  '>
//                             Get to know Crownlist
//                         </div>
//                         <p className='flex text-center align-middle font-light max-sm:max-w-lg  text-sm md:text-md  lg:px-45 px-1'>
//                             We believe in making discovery simple, trustworthy, and rewarding. Every listing is carefully curated to ensure quality, reliability, and value for our users
//                         </p>
//                         <div>
//                             <Image
//                                 src={'/aboutimg.png'}
//                                 alt='about-image'
//                                 width={800}
//                                 height={600}
//                                 className='object contain'
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* core values */}
//             <div className='bg-[#FAFAFA] p-6 mt-4 w-full'>
//                 <div className='flex w-full  text-center  justify-center font-bold text-2xl  '>
//                     Core Values
//                 </div>
//                 <div className='grid grid-cols-1 md:grid-cols-3 p-3 mt-3'>
//                     {coreValues.map((data, index) => (
//                         <div className={`flex w-full flex-col gap-1 justify-center max-sm:items-center p-3 ${data.mid ? 'md:border-x-[1px] md:border-[#EDEEEF] md:px-6' : 'border-none'} `} key={index}>
//                             <div className='mb-2 max-md:hidden'>
//                                 <Image
//                                     src={data.img}
//                                     alt={data.title}
//                                     height={17}
//                                     width={17}
//                                     className='object-contain'
//                                 />
//                             </div>
//                             <div className='mb-2 md:hidden'>
//                                 <Image
//                                     src={data.img}
//                                     alt={data.title}
//                                     height={25}
//                                     width={25}
//                                     className='object-contain'
//                                 />
//                             </div>
//                             <div className='font-semibold'>
//                                 {data.title}</div>
//                             <div className='max-md:text-center'>{data.content}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {/* second slide of the page */}
//             <div className='flex flex-col gap-3 items-center justify-center container'>

//                 <div className='md:hidden flex flex-col gap-7 items-center justify-center p-4  '>
//                     {data.map((data) => (
//                         <div className='flex flex-col gap-3 w-full justify-center align-middle ' key={data.title}
//                         >
//                             <div className=' '>
//                                 <Image
//                                     src={data.img}
//                                     alt={data.title}
//                                     height={900}
//                                     width={700}
//                                     className='w-full rounded-t-3xl'
//                                 />
//                             </div>
//                             <div className='flex flex-col items-center'>
//                                 <div className='flex font-semibold  px-2'>
//                                     {data.title}
//                                 </div>
//                                 <div className='flex text-center font-light  px-2 '>
//                                     {data.content}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//                 {/* for desktop view */}
//                 <div className='hidden md:flex flex-col gap-7 items-center justify-between p-10 w-full align-middle  '>
//                     {/* first content */}
//                     <div className='flex flex-row-reverse  w-full justify-between align-middle'>
//                         <div className=' flex h-[100%] align-middle justify-center items-center '>
//                             <Image
//                                 src={'/miss1.png'}
//                                 alt={'Our Mission'}
//                                 height={1200}
//                                 width={500}
//                                 className='w-full  max-h-[425px]
//                                 object-cover
//                                 rounded-tl-3xl rounded-bl-3xl'
//                             />
//                         </div>
//                         <div className=' flex flex-col gap-2 justify-center align-middle p-5
//                         '>
//                             <div className='flex font-semibold text-2xl px-2 text-[#2B2B2B]'>
//                                 Our Mission
//                             </div>
//                             <div className='flex font-light  p-2 w-full max-w-md'>
//                                 To make discovery simple, trusted, and rewarding by connecting people with the best services, brands, and experiences empowering them to make confident choices and celebrate every success
//                             </div>
//                         </div>
//                     </div>
//                     {/* second content */}
//                     <div className='flex flex-row  w-full justify-between'>
//                         <div className=' flex h-[100%] align-middle justify-center items-center '>
//                             <Image
//                                 src={'/viss1.png'}
//                                 alt={'Our Mission'}
//                                 height={1200}
//                                 width={900}
//                                 className='w-full  max-h-[425px]
//                                 object-cover
//                                 rounded-tl-3xl rounded-bl-3xl'
//                             />
//                         </div>
//                         <div className=' flex flex-col h-full  gap-1  justify-center align-middle p-5
//                         '>
//                             <div className='flex font-semibold text-2xl px-2 text-[#2B2B2B]'>
//                                 Our Vision
//                             </div>
//                             <div className='flex font-light  p-2 w-full max-w-md'>
//                                 To become the world’s most trusted platform for curated discovery, where every connection leads to greater confidence, meaningful experiences, and lasting value
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AboutUs