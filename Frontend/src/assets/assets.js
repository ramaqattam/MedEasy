import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import MainLogoFinal from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'

import ceo from './ceo.png'
import cto from './cto.png'
import medical_director from './medical_director.png'
import operations from './operations.png'

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    MainLogoFinal,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    ceo,
    cto,
    medical_director,
    operations,
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Ahmad Al-Zoubi',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Ahmad Al-Zoubi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Zoubi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'King Abdullah II Street',
            line2: 'Amman Governorate, Jordan'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Tasneem Al-shishani',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Tasneem Al-shishani has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Jaber has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'University Street',
            line2: 'Irbid Governorate, Jordan'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Mohammad Al-Shdeifat',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Mohammad Al-Shdeifat has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Shdeifat has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Wasfi Al-Tal Street',
            line2: 'Amman Governorate, Jordan'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Mazen Al-Tarawneh',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Mazen Al-Tarawneh has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Tarawneh has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Downtown Area',
            line2: 'Karak Governorate, Jordan'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Nour Al-Rawabdeh',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Nour Al-Rawabdeh has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Rawabdeh has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'King Talal Street',
            line2: 'Zarqa Governorate, Jordan'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Hosam Al-Majali',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Hosam Al-Majali has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Majali has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Jerusalem Street',
            line2: 'Ma\'an Governorate, Jordan'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Saif Khory',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Saif Khory has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Khory has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Independence Street',
            line2: 'Balqa Governorate, Jordan'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Omar Alhaj',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Omar Alhaj has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Alhaj has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Queen Rania Street',
            line2: 'Ajloun Governorate, Jordan'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Lina Mansour',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Lina Mansour has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Mansour has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Salt Street',
            line2: 'Jerash Governorate, Jordan'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Sami Haddad',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Sami Haddad has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Haddad has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Palestine Street',
            line2: 'Madaba Governorate, Jordan'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Rami Al-Qeisi',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Rami Al-Qeisi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Qeisi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Jordan Street',
            line2: 'Tafilah Governorate, Jordan'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Hani Al-Momani',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Hani Al-Momani has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Momani has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Mecca Street',
            line2: 'Aqaba Governorate, Jordan'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Dana Al-Kurdi',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Dana Al-Kurdi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Kurdi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Prince Hassan Street',
            line2: 'Amman Governorate, Jordan'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Zaid Al-Omari',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Zaid Al-Omari has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Omari has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Medina Munawara Street',
            line2: 'Irbid Governorate, Jordan'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Rana Al-Abbadi',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Rana Al-Abbadi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Al-Abbadi has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        address: {
            line1: 'Gardens Street',
            line2: 'Zarqa Governorate, Jordan'
        }
    },
]