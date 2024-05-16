"use client"
import React, { useState } from 'react';
import { FaGoogle, FaTwitter } from "react-icons/fa";
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
    const router = useRouter()
    const initialValue = {
        username: "",
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        display_name: "",
        phone: ""
    };
    const [formData, setFormData] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        display_name: "",
        phone: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let valid = true;
        const newErrors = { ...formErrors };
        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
                newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
                valid = false;
            }
        });

        if (!valid) {
            setFormErrors(newErrors);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                setFormErrors(initialValue);
                setFormData(initialValue);
                router.push('/login')
            } else {
                console.error("Registration failed:", res.statusText);
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    const handleSocialSignIn = async (provider: string) => {
        try {
            await signIn(provider, { callbackUrl: '/' });
        } catch (error) {
            console.error("Error during social login:", error);
        }
    };

    return (
        <>
            <div className="okv4-section">
                <div className="ok-container">
                    <div className="login-page-wrapper grid">
                        <form className="ok-user-login">
                            <div className="ok-conv-login-box">
                                <div>

                                    <h3>दर्ता गर्नुहोस्</h3>
                                    <div className="frm-fld">
                                        <input type="text" placeholder="नाम" name="name" className={`username ${formErrors.name && 'invalid'}`} onChange={handleChange} value={formData.name} required />
                                        {formErrors.name && <span className="form-error ">{formErrors.name}</span>}
                                    </div>
                                    <div className="frm-fld">
                                        <input type="text" placeholder="प्रयोगकर्ता नाम" name="username" className={`username ${formErrors.username && 'invalid'}`} onChange={handleChange} value={formData.username} required />
                                        {formErrors.username && <span className="form-error ">{formErrors.username}</span>}
                                    </div>
                                    <div className="frm-fld">
                                        <input type="email" placeholder="इमेल" name="email" className={`username ${formErrors.email && 'invalid'}`} onChange={handleChange} value={formData.email} required />
                                        {formErrors.email && <span className="form-error ">{formErrors.email}</span>}
                                    </div>
                                    <div className="frm-fld">
                                        <input type="password" placeholder="पासवर्ड" name="password" className={`password ${formErrors.password && 'invalid'}`} onChange={handleChange} value={formData.password} required />
                                        {formErrors.password && <span className="form-error ">{formErrors.password}</span>}
                                    </div>
                                    <div className="frm-fld">
                                        <input type="password" placeholder="पासवर्ड सुनिश्चित गर्नुहोस" name="confirm_password" className={`password ${formErrors.confirm_password && 'invalid'}`} onChange={handleChange} value={formData.confirm_password} required />
                                        {formErrors.confirm_password && <span className="form-error ">{formErrors.confirm_password}</span>}
                                    </div>
                                    <div className="frm-fld">
                                        <input type="text" placeholder="प्रदर्शन नाम" name="display_name" className={`username ${formErrors.display_name && 'invalid'}`} onChange={handleChange} value={formData.display_name} required />
                                        {formErrors.display_name && <span className="form-error ">{formErrors.display_name}</span>}
                                    </div>
                                    <div className="frm-fld">
                                        <input type="text" placeholder="फोन/मोबाइल" name="phone" className={`username ${formErrors.phone && 'invalid'}`} onChange={handleChange} value={formData.phone} required />
                                        {formErrors.phone && <span className="form-error ">{formErrors.phone}</span>}
                                    </div>

                                    <div className="ok-btn-wrapper">
                                        <button className="btn primary primary-gradient rounded w-full" type="submit" onClick={handleSubmit}>
                                            साइन अप
                                        </button>
                                        <span>पहिले नै खाता छ?</span> <Link href="/login" className="ok-signup-trigger">अहिले साइन इन गर्नुहोस्</Link>
                                    </div>
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
                                    {/* <h4>कृपया ध्यान दिनुहोस्:</h4> */}
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

export default Register;
