
"use client"
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { MdLogout } from "react-icons/md";
import { FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Logout from '../Offcanvas/Popup/LogoutPop';
import { useRoot } from '../../../context';
import { usePathname } from "next/navigation";
import { PiUserCircleDuotone } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { destroyCookie } from 'nookies';
const NavBar = ({ currentdate }) => {
  const pathName = usePathname();
  const { data: session, status } = useSession();
  const { siteSetting, userInfo } = useRoot()
  const [logoutPop, setLogoutPop] = useState(false);

  const handleLogoutPop = () => {
    setLogoutPop(!logoutPop);
  };
  const handleCloseLogout = () => {
    setLogoutPop(false);
  };

  const [toggle, setToggle] = useState(false);

  const toggleMenu = () => {
    setToggle(!toggle);
  };

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    setOpenDropdown(!openDropdown)
  }

  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    // destroyCookie(null, 'ok_reg_user');
    // router.push('/'); // Redirect to the homepage
    window.location.href = "/"
  }

  return (
    <>
      <header id="masthead" className="site-header header-health">
        <div className="okv4-container flx">
          <div className="header-main-left-items">
            <Link href="/" className="site-logo">
              {
                siteSetting.main_logo && (

                  <img
                    src={siteSetting.main_logo}
                    alt="Ok Logo"
                  />
                )
              }
              {/* <div
                className="ok-current-time ok18-date-holder "
                data-today=""
              >
                {currentdate.bs_date_np} {currentdate.bs_month_np} {currentdate.bs_year_np} , {currentdate.day_np}
              </div> */}
            </Link>
            <div className="prime-nav">
              <a href="https://www.onlinekhabar.com/content/news/rastiya" target='_blank'>समाचार</a>
              <a href="https://www.onlinekhabar.com/health" target='_blank'>स्वास्थ्य</a>
              <a href="https://www.onlinekhabar.com/sports" target='_blank'>खेलकुद</a>
              <a href="https://www.onlinekhabar.com/markets" target='_blank'>शेयर मार्केट</a>
            </div>
          </div>
          <div className="header-main-right-items">
            <div className="utils right-utils">
              {status === 'authenticated' && (
                <div className='user__profile' onClick={handleDropdownClick} ref={dropdownRef}>

                  {/* {session?.user?.image ? (
                    <img src={session.user.image} alt="User Image" />

                  ) : (
                    <> */}

                  {
                    userInfo && userInfo.photo ? (
                      <img src={userInfo.photo} alt="User Image" />
                    ) : (
                      <span>
                        {
                          userInfo && userInfo.display_name && userInfo.display_name.charAt(0)
                        }
                      </span>
                    )
                  }
                  {/* </>
                  // )} */}

                  {openDropdown && (
                    <div className="user__dropdown">
                      <div className='user__dropdown__item'>
                        <Link href="/profile">
                          <PiUserCircleDuotone /> प्रोफाइल
                        </Link>
                      </div>
                      <div className='user__dropdown__item' onClick={handleLogoutPop}>
                        <IoMdLogOut />  लग-आउट
                      </div>
                    </div>
                  )}
                </div>
              )}

              {status === 'unauthenticated' && (
                <Link href="/login" className="btn primary primary-gradient rounded">
                  लगइन
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <nav className={`site-nav ${toggle ? 'open' : ''}`}>
        <div className="okv4-container">
          <div className="flex-between">
            <ul className="desktop-menu">
              <li className={`${pathName === "/" ? "page-label" : ""}`}>
                <Link href="/" >
                  क्यालेन्डर
                </Link>
              </li>
              <li className={`${pathName === "/holiday" ? "page-label" : ""}`}>
                <Link href="/holiday" >बिदाहरु</Link>
              </li>
              <li className={`${pathName === "/sahit" ? "page-label" : ""}`}>
                <Link href="/sahit" >साईत</Link>
              </li>
              <li className={`${pathName === "/panchanga" ? "page-label" : ""}`}>
                <Link href="/panchanga" >पञ्चाङ्ग</Link>
              </li>
              <li className={`${pathName === "/rashifal" ? "page-label" : ""}`}>
                <Link href="/rashifal" >राशिफल</Link>
              </li>
              <li className={`${pathName === "/bullion" ? "page-label" : ""}`}>
                <Link href="/bullion" >सुन-चाँदी</Link>
              </li>
              <li className={`${pathName === "/event" ? "page-label" : ""}`}>
                <Link href="/event" >
                  इभेन्ट
                </Link>
              </li>
              {
                status === 'authenticated' && (
                  <li className={`${pathName === "/reminder" ? "page-label" : ""}`}>
                    <Link href="/reminder" >
                      रिमाइन्डर
                    </Link>
                  </li>

                )
              }
            </ul>
            <div className="ham__menu mobile-menu">
              <div onClick={toggleMenu} className="hamburger-menu-button">
                {toggle ? <FaTimes /> : <RxHamburgerMenu size="1.5rem" className="hamburger-menu-icon" />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {toggle && (
        <div className="custom__offcanvas active">
          <div className="overlay" onClick={toggleMenu}></div>
          <div className="offcanvas__content menu__content">
            <div className="menu__offcanvas__close close__offcanvas">
              <div onClick={toggleMenu} className="hamburger-menu-button">
                {toggle ? <FaTimes /> : <RxHamburgerMenu size="1.5rem" className="hamburger-menu-icon" />}
              </div>
            </div>

            <div className="offcanvas__logo">
              <Link href="/" className="site-logo">
                {
                  siteSetting.main_logo && (

                    <img
                      src={siteSetting.main_logo}
                      alt="Ok Logo"
                    />
                  )
                }
                <div className="ok-current-time ok18-date-holder" data-today="">
                  {currentdate.bs_date_np} {currentdate.bs_month_np} {currentdate.bs_year_np} , {currentdate.day_np}
                </div>
              </Link>
            </div>
            <ul>
              <li>
                <a href="https://www.onlinekhabar.com/content/news/rastiya" target='_blank'>समाचार</a>
              </li>
              <li>
                <a href="https://www.onlinekhabar.com/health" target='_blank'>स्वास्थ्य</a>

              </li>
              <li>
                <a href="https://www.onlinekhabar.com/sports" target='_blank'>खेलकुद</a>

              </li>
              <li>
                <a href="https://www.onlinekhabar.com/markets" target='_blank'>शेयर मार्केट</a>

              </li>
              <li onClick={toggleMenu}>
                <Link href="/holiday" >बिदाहरु</Link>
              </li>
              <li onClick={toggleMenu}>
                <Link href="/sahit" >साईत</Link>
              </li>
              <li onClick={toggleMenu}>
                <Link href="/panchanga" >पञ्चाङ्ग</Link>
              </li>
              <li onClick={toggleMenu}>
                <Link href="/rashifal" >राशिफल</Link>
              </li>
              <li onClick={toggleMenu}>
                <Link href="/event" >
                  इभेन्ट
                </Link>
              </li>
              {
                status === 'authenticated' && (
                  <li onClick={toggleMenu}>
                    <Link href="/reminder" >
                      रिमाइन्डर
                    </Link>
                  </li>

                )
              }
            </ul>
          </div>
        </div>
      )}

      {
        logoutPop && <Logout onClose={handleCloseLogout} onLogout={handleLogout} />
      }
    </>
  );
};

export default NavBar;


