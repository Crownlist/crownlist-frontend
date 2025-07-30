// /* eslint-disable */
import Image from 'next/image'

const data = [
    { img: '/miss1.png', title: 'Our Mission', content: "To make discovery simple, trusted, and rewarding by connecting people with the best services, brands, and experiences empowering them to make confident choices and celebrate every success" },
    {
        img: '/viss1.png', title: 'Our Vision', content: "To become the world’s most trusted platform for curated discovery, where every connection leads to greater confidence, meaningful experiences, and lasting value"
    }
]
const coreValues = [
    {
        img: '/medal.svg',
        title: 'Curated excellence',
        content: 'We believe users deserve the best. Every listing is carefully selected to meet high standards of value and reliability'
    },
    {
        img: '/emp.svg',
        title: 'Empowerment through choice',
        content: 'We empower our community by giving them the tools and knowledge to make confident, informed decisions',
        mid: true
    },
    {
        img: '/security.svg',
        title: 'Integrity always',
        content: 'We hold ourselves accountable to the highest ethical standards because reputation is earned, not given'
    }
]

const AboutUs = () => {
    return (
        <div className='flex flex-col w-full container '>
            <div className=''>
                <div className='flex items-center align-middle justify-center p-4  py-8 container '>
                    <div className='flex flex-col items-center justify-center align-middle text-center gap-3'>
                        <div className='flex bg-[#DBD2FE] text-[#1F058F] text-semibold rounded-full px-3'>
                            About Us
                        </div>
                        <div className='flex font-semibold md:text-4xl  '>
                            Get to know Crownlist
                        </div>
                        <p className='flex text-center align-middle font-light max-sm:max-w-lg  text-sm md:text-md  lg:px-45 px-1'>
                            We believe in making discovery simple, trustworthy, and rewarding. Every listing is carefully curated to ensure quality, reliability, and value for our users
                        </p>
                        <div>
                            <Image
                                src={'/aboutimg.png'}
                                alt='about-image'
                                width={800}
                                height={600}
                                className='object contain'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* core values */}
            <div className='bg-[#FAFAFA] p-6 mt-4 w-full'>
                <div className='flex w-full  text-center  justify-center font-bold text-2xl  '>
                    Core Values
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 p-3 mt-3'>
                    {coreValues.map((data, index) => (
                        <div className={`flex w-full flex-col gap-1 justify-center max-sm:items-center p-3 ${data.mid ? 'md:border-x-[1px] md:border-[#EDEEEF] md:px-6' : 'border-none'} `} key={index}>
                            <div className='mb-2 max-md:hidden'>
                                <Image
                                    src={data.img}
                                    alt={data.title}
                                    height={17}
                                    width={17}
                                    className='object-contain'
                                />
                            </div>
                            <div className='mb-2 md:hidden'>
                                <Image
                                    src={data.img}
                                    alt={data.title}
                                    height={25}
                                    width={25}
                                    className='object-contain'
                                />
                            </div>
                            <div className='font-semibold'>
                                {data.title}</div>
                            <div className='max-md:text-center'>{data.content}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* second slide of the page */}
            <div className='flex flex-col gap-3 items-center justify-center container'>

                <div className='md:hidden flex flex-col gap-7 items-center justify-center p-4  '>
                    {data.map((data) => (
                        <div className='flex flex-col gap-3 w-full justify-center align-middle ' key={data.title}
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
                            <div className='flex flex-col items-center'>
                                <div className='flex font-semibold  px-2'>
                                    {data.title}
                                </div>
                                <div className='flex text-center font-light  px-2 '>
                                    {data.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* for desktop view */}
                <div className='hidden md:flex flex-col gap-7 items-center justify-between p-10 w-full align-middle  '>
                    {/* first content */}
                    <div className='flex flex-row-reverse  w-full justify-between align-middle'>
                        <div className=' flex h-[100%] align-middle justify-center items-center '>
                            <Image
                                src={'/miss1.png'}
                                alt={'Our Mission'}
                                height={1200}
                                width={500}
                                className='w-full  max-h-[425px] 
                                object-cover
                                rounded-tl-3xl rounded-bl-3xl'
                            />
                        </div>
                        <div className=' flex flex-col gap-2 justify-center align-middle p-5
                        '>
                            <div className='flex font-semibold text-2xl px-2 text-[#2B2B2B]'>
                                Our Mission
                            </div>
                            <div className='flex font-light  p-2 w-full max-w-md'>
                                To make discovery simple, trusted, and rewarding by connecting people with the best services, brands, and experiences empowering them to make confident choices and celebrate every success
                            </div>
                        </div>
                    </div>
                    {/* second content */}
                    <div className='flex flex-row  w-full justify-between'>
                        <div className=' flex h-[100%] align-middle justify-center items-center '>
                            <Image
                                src={'/viss1.png'}
                                alt={'Our Mission'}
                                height={1200}
                                width={900}
                                className='w-full  max-h-[425px] 
                                object-cover
                                rounded-tl-3xl rounded-bl-3xl'
                            />
                        </div>
                        <div className=' flex flex-col h-full  gap-1  justify-center align-middle p-5
                        '>
                            <div className='flex font-semibold text-2xl px-2 text-[#2B2B2B]'>
                                Our Vision
                            </div>
                            <div className='flex font-light  p-2 w-full max-w-md'>
                                To become the world’s most trusted platform for curated discovery, where every connection leads to greater confidence, meaningful experiences, and lasting value
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs