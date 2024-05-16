"use client"
import React, { useState, useContext } from 'react';
import { FaGoogle, FaTwitter } from "react-icons/fa";
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
    content: string;
    grid: string
}

const Login: React.FC<Props> = ({ content, grid }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const router = useRouter();
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [rees, setress] = useState<any>();

    const { data: session, status } = useSession();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (status === "authenticated") {
        router.push("/")
    }

    const handleCredentialsSignIn = async (e) => {
        e.preventDefault()
        if (!formData.username || !formData.password) {
            setFormError("All fields are necessary.");
            return;
        }
        try {
            setIsSubmit(true);


            // const res = await signIn('credentials', { ...formData, redirect: false });
            const res = await signIn('credentials', { ...formData, redirect: false, callbackUrl: '/' });

            setress(res)

            if (res?.error) {
                setFormError("Invalid Username or Password");
                setIsSubmit(false);

            } else {
                setIsSubmit(false);
                setFormError("")
                setFormSuccess("Login Successful");
                // router.push('/'); // Redirect to the homepage
                window.location.href = "/"
            }
        } catch (error) {
            setIsSubmit(false);
            console.error("Error during login:", error);
            setFormError("An error occurred during login. Please try again.");

        }
    };


    const handleSocialSignIn = async (provider: string) => {
        try {
            //   const res =  await signIn(provider);
            await signIn(provider, { callbackUrl: '/' });
        } catch (error) {
            console.error("Error during social login:", error);
        }
    };

    return (
        <>
            <div className="okv4-section">
                <div className="ok-container">
                    <div className={`login-page-wrapper ${grid === "grid-one" ? "no-grid" : "grid"}`}>
                        <form className="ok-user-login" >
                            <div className="ok-conv-login-box">
                                <div>
                                    <h3>लगइन</h3>
                                    {
                                        content && (
                                            <p className='ok-note'>
                                                {content}
                                            </p>
                                        )
                                    }
                                    <div className="frm-fld">
                                        <input type="text" placeholder="प्रयोगकर्ता नाम" name="username" onChange={handleChange} className="username" />
                                    </div>
                                    <div className="frm-fld">
                                        <input type="password" placeholder="पासवर्ड" name='password' onChange={handleChange} className="password" />

                                    </div>
                                    <div className="frm-fld flex-box field-remember">
                                        <div className="rememberme">
                                            <input type="checkbox" className="remember-me" />
                                            <span>मलाई सम्झनुहोस्</span>

                                        </div>
                                        <a href="#" className="ok-forget-password-trigger">पासवर्ड भुल्नु भयो?</a>
                                    </div>
                                    <div className="ok-btn-wrapper">
                                        <button
                                            type="submit"
                                            className="btn primary primary-gradient rounded w-full"
                                            disabled={isSubmit}
                                            onClick={handleCredentialsSignIn}
                                        >
                                            {isSubmit ?
                                                (
                                                    <>
                                                        कृपया पर्खनुहोस्
                                                        <span className="loader btn-loader"></span>
                                                    </>
                                                )
                                                : "लगइन"}
                                        </button>
                                        <span>खाता छैन?</span> <Link href="/register" className="ok-signup-trigger">अहिले साइन अप गर्नुहोस्</Link>
                                    </div>
                                    {
                                        formError && (
                                            <div className="form-message form-response-message ok-error">
                                                {formError}
                                            </div>
                                        )
                                    }

                                    {
                                        formSuccess && (
                                            <div className="form-message form-response-message ok-success">
                                                {formSuccess}
                                            </div>
                                        )
                                    }
                                    <div className="ok-login-with-social">
                                        <h5>वा सोशल मिडिया प्रयोग गर्नुहुन्छ? </h5>
                                        <a onClick={() => handleSocialSignIn('google')} className="with-google ok-social-login-trigger">
                                            <FaGoogle />
                                            <span>गूगल</span>
                                        </a>
                                        <a onClick={() => handleSocialSignIn('twitter')} className="with-tw ok-social-login-trigger">
                                            <FaTwitter />
                                            <span>ट्विटर</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="ok-login-desc">
                                    {/* <h4>किन दर्ता हुने ?</h4> */}
                                    <ul>
                                        <li>अनलाइनखबर पात्रोमा आफ्नो निजी कार्यक्रम वा रिमाइन्डर राख्नका लागि अनिवार्य रजिस्ट्रेसन गर्नुपर्नेछ।</li>
                                        <li>आफ्नो इमेल वा गुगल आइडी या ट्वीटरमार्फत पनि सजिलै लगइन गर्न सकिनेछ।</li>
                                        <li>अनलाइनखबर लगइन गरेर यहाँ प्रकाशित सामग्रीमा प्रतिक्रिया दिंदा तपाइँले लगइन गर्दा उल्लेख गरेको नाम देखिनेछ।</li>
                                        <li>यदि वास्तविक नामबाट कमेन्ट गर्न चाहनुहुन्न भने डिस्प्ले नेममा सुविधाअनुसारको निकनेम र प्रोफाइल फोटो परिवर्तन गर्नुहोस् अनि ढुक्कले कमेन्ट गर्नुहोस्, तपाइँको वास्तविक पहिचान गोप्य राखिनेछ।</li>
                                        <li>रजिस्ट्रेसनसँगै बन्ने प्रोफाइलमा तपाइँले गरेका कमेन्ट, रिप्लाई, लाइक र डिसलाइक जस्ता गतिविधीहरुको एकमुष्ट विवरण हेर्न सकिन्छ।</li>
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
