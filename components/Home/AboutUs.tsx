 
import Image from 'next/image'

const data = [
    {
        img: '/ostory.svg', title: 'Our Story', content: "CROWNLIST began with a simple yet powerful idea in 2025: a student's desire to easily locate nearby hostels. What started as a focused solution quickly blossomed into a broader vision after a week of dedicated research. Recognizing the need for a user-friendly platform to buy and sell a variety of goods, organized by category, CROWNLIST was born. Starting with essentials like real estate and home appliances, our journey is one of continuous growth, with plans to expand our offerings to meet the diverse needs of our community."
    },
    { img: '/omission.svg', title: 'Our Mission', content: "Our mission at CROWNLIST is to connect buyers and sellers in a safe and user-friendly environment. We empower sellers by providing a platform to reach a wider audience and increase their sales. Simultaneously, we strive to help buyers effortlessly discover diverse sellers and find the products they desire at various price points, fostering a thriving and accessible marketplace for all." },
    {
        img: '/ovision.svg', title: 'Our Vision', content: "Our vision for CROWNLIST is to become the leading online marketplace known for its safety, user-friendliness, and comprehensive range of products. We aim to continuously expand our categories and innovative features, like our product request system, ensuring there's something for everyone. Ultimately, we aspire to create a seamless and empowering e-commerce experience that benefits both buyers and sellers alike."
    }
]

const AboutUs = () => {
    return (
        <div className='flex flex-col w-full '>
            <div className='bg-[#1F058F]'>
                <div className='flex items-center align-middle justify-center p-4 text-white py-8 container '>
                    <div className='flex flex-col items-center justify-center align-middle text-center gap-3'>
                        <div className='flex  max-sm:text-[#52a9ff]'>
                            About Us
                        </div>
                        <div className='flex font-semibold md:text-2xl  '>
                        Welcome to CROWNLIST : Where Buying and Selling is Made Simple! 
                        </div>
                        <p className='flex text-center align-middle font-light  text-sm  lg:px-45 px-1'>
                        Welcome to CROWNLIST, your trusted marketplace connecting buyers and sellers in a secure and intuitive online space. Founded in 2025, we&aposre dedicated to empowering both sides of the transaction – enabling sellers to expand their reach and helping buyers discover a diverse range of products at competitive prices. From our beginnings as a student&aposs solution to finding local housing, we&aposve grown into a platform committed to simplifying commerce for everyone.
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
                    <div className='flex flex-row-reverse  max-w-6xl bg-[#ededed] w-full justify-between rounded-tr-3xl rounded-br-3xl'>
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
                        <div className=' flex flex-col gap-3 flex-1 justify-start p-5
                        '>
                            <div className='flex font-semibold  px-2 text-[#2B2B2B]'>
                                Our Story
                            </div>
                            <div className='flex font-light  p-2 '>
                            CROWNLIST began with a simple yet powerful idea in 2025: a student&aposs desire to easily locate nearby hostels. What started as a focused solution quickly blossomed into a broader vision after a week of dedicated research. Recognizing the need for a user-friendly platform to buy and sell a variety of goods, organized by category, CROWNLIST was born. Starting with essentials like real estate and home appliances, our journey is one of continuous growth, with plans to expand our offerings to meet the diverse needs of our community.
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
                        <div className=' flex flex-col gap-3 flex-1 justify-start p-5
                        '>
                            <div className='flex font-semibold  px-2 text-[#2B2B2B]'>
                                Our Mission
                            </div>
                            <div className='flex font-light  p-2 w-full'>
                            At CROWNLIST, our fundamental mission is to cultivate a thriving and trustworthy online ecosystem that seamlessly connects buyers and sellers within a safe and exceptionally user-friendly environment. We are deeply committed to empowering sellers by providing them with a robust platform to significantly expand their reach, effectively market their diverse offerings, and ultimately achieve increased sales and business growth. Simultaneously, we dedicate ourselves to enriching the buying experience by enabling individuals to effortlessly discover a wide array of sellers, each presenting unique products and varied pricing options.
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
                        <div className=' flex flex-col gap-3 flex-1 justify-start p-5
                        '>
                            <div className='flex font-semibold  px-2 text-[#2B2B2B]'>
                                Our Vision
                            </div>
                            <div className='flex font-light  p-2 '>
                            Our overarching vision for CROWNLIST is to evolve into the preeminent online marketplace, widely recognized and trusted for its unwavering commitment to safety, its intuitive and enjoyable user experience, and its comprehensive and ever-expanding catalog of products and services. We aspire to continuously innovate and integrate cutting-edge features, such as our unique product request system, to anticipate and exceed the evolving needs of our user base. We envision a future where CROWNLIST is the first destination for individuals seeking to buy or sell anything, fostering a global community of engaged participants. 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs