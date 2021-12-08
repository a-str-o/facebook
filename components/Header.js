import Image from 'next/image'
import logo from '../loca.png'
import profile from '../younes.jpg'
import HeaderIcon from './HeaderIcon'

import {
    BellIcon,
    ChatIcon,
    ChevronDownIcon,
    HomeIcon,
    UserGroupIcon,
    ViewGridIcon,
} from '@heroicons/react/solid';
import {
    FlagIcon,
    PlayIcon,
    SearchIcon,
    ShoppingCartIcon,
} from '@heroicons/react/outline'

function Header() {
    
    return (
        <div className="sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 shadow-md">
            {/* left */}
            <div className="flex items-center">
                <Image 
                    src= {logo}
                    width={40}
                    height={40} 
                    layout="fixed"
                />
                <div className="flex ml-2 items-center rounded-full bg-gray-100 p-2">
                    <SearchIcon className="h-6 text-gray-500"/>
                    <input 
                        className="hidden md:inline-flex flex items-center bg-transparent outline-none
                            placeholder-gray-500 flex-shrink"
                        type="text" placeholder="Search"/>
                </div>
            </div>
            {/* center */}
            <div className="flex justify-center flex-grow">
                <div  className="flex space-x-6 md:space-x-2">
                    <HeaderIcon active={true} Icon={HomeIcon}/>
                    <HeaderIcon active={false} Icon={FlagIcon}/>
                    <HeaderIcon active={false} Icon={PlayIcon}/>
                    <HeaderIcon active={false} Icon={ShoppingCartIcon}/>
                    <HeaderIcon active={false} Icon={UserGroupIcon}/>
                </div>
            </div>
            {/* right */}
            <div className="flex items-center sm:space-x-2 justify-end">
                <Image 
                className="rounded-full h-24 w-24 flex items-center justify-center..."
                        src= {profile}
                        width={40}
                        height={40} 
                        layout="fixed"
                    />
                <p className="whitespace-nowrap  items-center ml-2  
                            font-semibold pr-3">johnas</p>
                        <ViewGridIcon className="icon"/>
                        <ChatIcon className="icon"/>
                        <BellIcon className="icon"/>
                        <ChevronDownIcon className="icon"/>
            </div>
        </div>
    )
}

export default Header
