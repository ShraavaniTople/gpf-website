import { useState, useEffect, useRef, useMemo } from 'react'

const ACCESS_PASSWORD = '2526@WIPfest'
const SESSION_KEY     = 'tgpf_checkin_auth'
const STORAGE_KEY     = 'tgpf2026_checkins'

type Tier   = 'General' | 'VIP' | 'Premium' | 'Hackathon'
type Bucket = 'Speaker' | 'Hackathon' | 'VIP' | 'Premium' | 'General'
type Attendee = {
  name: string; email: string; company: string; role: string
  tier: Tier; bucket: Bucket
}

// ── helper: same hash as the Python send scripts ──────────────────────────────
function genPass(email: string, tier: Tier): string {
  const e = email.toLowerCase().trim()
  let h = 0
  for (const c of e) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF
  const pre = tier === 'VIP' ? 'V' : tier === 'Premium' ? 'P' : tier === 'Hackathon' ? 'H' : 'G'
  return `GPF26-${pre}-${h.toString(16).toUpperCase().padStart(6, '0')}`
}

function mk(name: string, email: string, company: string, role: string, tier: Tier, bucket?: Bucket): Attendee {
  const b: Bucket = bucket ?? (
    tier === 'Hackathon' ? 'Hackathon' :
    tier === 'VIP'       ? 'VIP'       :
    tier === 'Premium'   ? 'Premium'   : 'General'
  )
  return { name, email, company, role, tier, bucket: b }
}

// ── Full attendee list (sourced from TGPF 2026 registration data) ─────────────
const RAW: Attendee[] = [

  // ── Speaker ─────────────────────────────────────────────────────────────────
  mk('Adithi Sampath', 'adithi.sampath@gmail.com', 'Stellantis', 'VP of Product & Design', 'VIP', 'Speaker'),
  mk('Aditya Singh', 'singhaditya@salesforce.com', 'Salesforce', 'VP, Product & India Site Head', 'VIP', 'Speaker'),
  mk('Amrit Raj', 'amritraj.91@gmail.com', 'WIP India', 'Founder', 'VIP', 'Speaker'),
  mk('Anshuman Awasthi', 'anshuman.awasthi@mercedes-benz.com', 'MBRDI', 'Senior VP', 'VIP', 'Speaker'),
  mk('Anuj Rathi', 'anuj@profound.club', 'Profound.me', 'Founder & CEO', 'VIP', 'Speaker'),
  mk('Bhavik Kaul', 'kaulbhavik@gmail.com', 'Ex-SuperMoney & LazyPay', 'CPO', 'VIP', 'Speaker'),
  mk('Deeksha Anand', 'deeksha.anand29@gmail.com', 'Google', 'Senior product marketing manager', 'VIP', 'Speaker'),
  mk('Devansh Ghatak', 'devansh@simplismart.ai', 'Simplismart', 'Co-founder & CTO', 'VIP', 'Speaker'),
  mk('Dharma Varahappian', 'dvarahappian@ebay.com', 'eBay', 'Product Leader', 'VIP', 'Speaker'),
  mk('Dilip K', 'dilip.mukkavalli@databricks.com', 'Databricks', 'Startups & Partnership Lead', 'VIP', 'Speaker'),
  mk('Dipika Jaikishan', 'djaikishan@withpronto.com', 'Pronto', 'VP Special Projects', 'VIP', 'Speaker'),
  mk('Ekta Shah', 'ektabshah1994@gmail.com', 'MSCI', 'Associate Data Scientist', 'VIP', 'Speaker'),
  mk('Gagandeep', 'aroragagandeep@gmail.com', 'Tata Digital', 'GM, Payments', 'VIP', 'Speaker'),
  mk('Ira Banerjee', 'ira@even.in', 'Even Health', 'Head of Clinical Product', 'VIP', 'Speaker'),
  mk('Jagriti Shreya', 'jagriti@vibtree.com', 'OneInbox', 'COO', 'VIP', 'Speaker'),
  mk('Jivesh Madan', 'jivesh@shastra.vc', 'Shastra VC', 'Principal', 'VIP', 'Speaker'),
  mk('Kavita Viswanath', 'kavita.viswanath@toasttab.com', 'Toast', 'SVP & Country Head', 'VIP', 'Speaker'),
  mk('Kushagra Swami', 'kushagraswami95@gmail.com', 'POP', 'AI Product Designer', 'VIP', 'Speaker'),
  mk('Lalitha Ramani', 'lalithark@google.com', 'Google', 'General Manager', 'VIP', 'Speaker'),
  mk('Mansi Jain', 'mansi.jain@glance.com', 'Glance', 'COO', 'VIP', 'Speaker'),
  mk('Minakshi Khuntia', 'minakshi.khuntia@freshworks.com', 'Freshworks', 'Senior Director, Product Management', 'VIP', 'Speaker'),
  mk('Mitasha Singh', 'mitasha@allthingstalent.in', 'All Things Talent', 'Founder', 'VIP', 'Speaker'),
  mk('Murali Swaminathan', 'murali.swaminathan@freshworks', 'Freshworks', 'CTO', 'VIP', 'Speaker'),
  mk('Neha Bagaria', 'neha@herkey.com', 'HerKey', 'Founder & CEO', 'VIP', 'Speaker'),
  mk('Nikkitha Shanker', 'nikkitha@superbryn.com', 'SuperBryn', 'Co-Founder & CEO', 'VIP', 'Speaker'),
  mk('Nitin Pulyani', 'nitin.pulyani@cashfree.com', 'Cashfree Payments', 'SVP, Product', 'VIP', 'Speaker'),
  mk('Omar Saud', 'omar.saud@karnatakadigital.in', 'Karnataka Digital Economy Mission', 'Manager- Startups & Innovation', 'VIP', 'Speaker'),
  mk('Penchala Tharun', 'penchalatharun@wanderfly.in', 'Wanderfly', 'Founder', 'VIP', 'Speaker'),
  mk('Poorvi Vijay', 'poorvi@elevationcapital.com', 'Elevation Capital', 'Principal', 'VIP', 'Speaker'),
  mk('Preksha A Ajmera', 'preksha.ajmera1@freshworks.com', 'Freshworks', 'Senior Manager - Product Management', 'VIP', 'Speaker'),
  mk('Priya Ahuja', 'hi@priyaahuja.in', 'Kitty Party', 'Angel Investor', 'VIP', 'Speaker'),
  mk('Pulkit Jain', 'pulkit.jain@vedantu.com', 'Vedantu', 'Co-Founder & CPO', 'VIP', 'Speaker'),
  mk('Radhika Yuvraj Iyengar', 'radhika.yuvraj@women-in-tech.org', 'WIT India', 'Country Director', 'VIP', 'Speaker'),
  mk('Raj Nayan Datta', 'raj@waterbridge.vc', 'WaterBridge Ventures', 'VP-Investments', 'VIP', 'Speaker'),
  mk('Rajat Harlalka', 'raj.harlalka@toasttab.com', 'Toast', 'Director of Product', 'VIP', 'Speaker'),
  mk('Rekha Poosala', 'rekha.poosala@gmail.com', 'Dell', 'Senior Engineering Manager', 'VIP', 'Speaker'),
  mk('Rishabh Golchha', 'rishabhg@venturecatalysts.in', 'Venture Catalysts', 'Managing Partner', 'VIP', 'Speaker'),
  mk('Ritika Chugh', 'ritika@milestoneinternet.com', 'Milestone Inc.', 'Head of Product', 'VIP', 'Speaker'),
  mk('Roshan Vadassery', 'roshan@permissionless.net', 'Zopu/Permissionless', 'Founder', 'VIP', 'Speaker'),
  mk('Sachin Jain', 'sachin.j@milestoneinternet.com', 'Milestone Inc.', 'Senior PM', 'VIP', 'Speaker'),
  mk('Sahil Gupta', 'sahil.gupta@murf.ai', 'Murf AI', 'Head of Product', 'VIP', 'Speaker'),
  mk('Sangeeta Bavi', 'sangeeta@anthropic.com', 'Anthropic', 'Head of Digital & Startup Growth', 'VIP', 'Speaker'),
  mk('Seema Kumar', 'seema.kumar@databricks.com', 'Databricks', 'Director, Field Engineering', 'VIP', 'Speaker'),
  mk('Shalini Dayanidhi', 'shalini.dayanidhi@gmail.com', 'M Venture Partners', 'Investments', 'VIP', 'Speaker'),
  mk('Sheetal Kale', 'sheetal.kale@dataart.com', 'DataArt India', 'Managing Director', 'VIP', 'Speaker'),
  mk('Shivalik Sen', 'shivalik@rapido.bike', 'Rapido', 'Associate Director, Data Products', 'VIP', 'Speaker'),
  mk('Sreedhar Gade', 'sreedhar.gade@freshworks.com', 'Freshworks', 'Head of AI & Data', 'VIP', 'Speaker'),
  mk('Srinivasan Govindarajan', 'srinivasan.govindarajan@freshworks.com', 'Freshworks', 'Senior Product Manager', 'VIP', 'Speaker'),
  mk('Subhadeep Mondal', 'subhadeep@kalaari.com', 'Kalaari Capital', 'Venture Partner', 'VIP', 'Speaker'),
  mk('Suman Gandham', 'suman@vobiz.ai', 'Vobiz AI', 'Co-Founder & CEO', 'VIP', 'Speaker'),
  mk('Supriya Rao', 'supriya.rao@clearroute.io', 'ClearRoute', 'India MD', 'VIP', 'Speaker'),
  mk('Swati Awasthi', 'swati@womeninproductindia.com', 'WIP India', 'Founder', 'VIP', 'Speaker'),
  mk('Tanay Agrawal', 'tanay.a@kronosx.ai', 'KronosX AI', 'Director of AI & Platform', 'VIP', 'Speaker'),
  mk('Usha Rengaraju', 'urengaraju@nvidia.com', 'NVIDIA', 'AI Technologist', 'VIP', 'Speaker'),
  mk('Utkarsh Gupta', 'utkarsh.gupta@freshworks.com', 'Freshworks', 'Staff Product Manager', 'VIP', 'Speaker'),
  mk('Vaishnavi Devi', 'gvaishnavid@gmail.com', 'Swiggy', 'AVP of Product', 'VIP', 'Speaker'),
  mk('Vijeta Pai', 'vijetapai90@gmail.com', 'Lumitia', 'Cloud and AI Advisor', 'VIP', 'Speaker'),
  mk('Vikas Bansal', 'bansal.vikas84@gmail.com', 'Groww', 'CPO', 'VIP', 'Speaker'),
  mk('Viswanathan Puthukode (Vishy)', 'viswanathan.puthukode@freshworks.com', 'Freshworks', 'DIrector, Product', 'VIP', 'Speaker'),

  // ── Hackathon ─────────────────────────────────────────────────────────────────
  mk('Aakash A', 'aakash.anbazhagan@toasttab.com', 'Toast', 'Senior Software Engineer', 'Hackathon'),
  mk('Adithya C H', 'adithya@meridiona.com', 'Meridiona', 'CTO', 'Hackathon'),
  mk('Akarsh Hegde', 'akarsh@meridiona.com', 'Meridiona', 'Founder', 'Hackathon'),
  mk('Anurag sarkar', 'sarkar@sift-talent.com', 'Sift', 'Founder', 'Hackathon'),
  mk('Arham Begani', 'arhambegani2@gmail.com', 'Forze', 'CEO', 'Hackathon'),
  mk('Arnab Das', 'raj713335@gmail.com', 'Target', 'Senior Engineer', 'Hackathon'),
  mk('Bala Saravanan K', 'balasaravanank.official@gmail.com', 'Saveetha Engineering College', 'Student', 'Hackathon'),
  mk('Bhavana M', 'bhavanabhan29@gmail.com', 'Kuamaraguru College of Technology', 'Student', 'Hackathon'),
  mk('Chethan Gowda S N', 'iamchethan2813@gmail.com', 'Presidency University', 'Student', 'Hackathon'),
  mk('Dhanishka C K', 'dhanishka1000@gmail.com', 'Kumaraguru College Of Technology', 'Student', 'Hackathon'),
  mk('Dineshraj Dhanapathy', 'dineshrajdhanapathy@gmail.com', 'Freelancer', 'Cloud', 'Hackathon'),
  mk('Ebenezer S', 'ebenezer.s.2007@gmail.com', 'Chennai Institute of technology', 'Student', 'Hackathon'),
  mk('Haridharshini J', 'haridharshinijayaraj@gmail.com', 'Saveetha Engineering College', 'Student', 'Hackathon'),
  mk('Hemashree', 'hemashree280307@gmail.com', 'Chennai Institute Of Technology', 'Student', 'Hackathon'),
  mk('Hemashree Sureshkumar', 'hemashrees.cse2024@citchennai.net', 'Chennai institute of technology', 'Student', 'Hackathon'),
  mk('Jonathan Jerrick B', 'jonathanjerrick1410@gmail.com', 'National Institute of Technology Tiruchirappalli', '3rd year btech student', 'Hackathon'),
  mk('KIRTHIK ROSHAN P', 'kirthikroshan60@gmail.com', 'Chennai Institute of Technology', 'Student', 'Hackathon'),
  mk('Lalasa Annam', 'lalasagoudannam@gmail.com', 'N.B.K.R. Institute of Science and Technology', 'Fresher', 'Hackathon'),
  mk('Lasya Annam', 'lasyagoudannam@gmail.com', 'N.B.K.R.Institute of Science and Technology.', 'Fresher', 'Hackathon'),
  mk('Manya Malik', 'manyajahnvi@gmail.com', 'ggsipu', 'student', 'Hackathon'),
  mk('Mayank Aggarwal', 'mayankaggarwal9722@gmail.com', 'Microsoft', 'Software Engineer', 'Hackathon'),
  mk('MOHITH GUNTAMADUGU', 'guntamadugumohith0601@gmail.com', 'Government Polytechnic Pillaripattu', 'Student', 'Hackathon'),
  mk('N. Hima Varshitha', 'nimmakayalahimavarshitha@gmail.com', 'AmritaViswa Vidyapeetam', 'Bengaluru', 'Hackathon'),
  mk('Nakul T', 'nakulnuked@gmail.com', 'KPR Institute of Engineering and Technology', 'B.Tech AI & Data Science Student', 'Hackathon'),
  mk('Niralya J', 'niralyaj.student@saveetha.ac.in', 'Saveetha Engineering College', 'student', 'Hackathon'),
  mk('Pavan Gowda S', 'pg0061375@gmail.com', 'RNSIT', 'Student', 'Hackathon'),
  mk('Pavan Kumar H', 'pavanh14@gmail.com', 'Accionlabs', 'Associate Architect', 'Hackathon'),
  mk('Pavan Raaj Annam', 'pavanraaj.annam@gmail.com', 'Freshworks', 'Software Engineer - Backend', 'Hackathon'),
  mk('Pavan sai Pokkalla', 'pavansaipokkalla@gmail.com', 'Govt Polytechnic,Pillaripattu', 'Student', 'Hackathon'),
  mk('Pratyaksh Kwatra', 'pratyakshkwatra@gmail.com', 'IP University', 'Student', 'Hackathon'),
  mk('Prithish S', 'neoprithish@gmail.com', 'Chennai Institute of Technology', 'Student', 'Hackathon'),
  mk('Ramanathan Manikandan', 'ramanathan.manikandan@gmail.com', 'Chennai Institute Of Technology', 'Student', 'Hackathon'),
  mk('Rhudhresh', 'rhudhresh3697@gmail.com', 'Saveetha engineering college', 'Student', 'Hackathon'),
  mk('S. Sri Sudarsan', 'srisudharshan2596@gmail.com', 'Freshworks', 'Staff Software Engineer', 'Hackathon'),
  mk('Sachin A S', 'sachin0621as@gmail.com', 'KPR Institute of Engineering and Technology', 'Student', 'Hackathon'),
  mk('Sadhana Shanmugam', 'sadhanashan12@gmail.com', 'Chennai Institute Of Technology', 'Student', 'Hackathon'),
  mk('Sai Charan A', 'saianandro@gmail.com', 'Chennai institute of technology', 'BE. CSE', 'Hackathon'),
  mk('Sangeetha S', 'sangeetha1232007@gmail.com', 'Saveetha Engineering College', 'Student', 'Hackathon'),
  mk('Sanjay E', 'sanjayelango06@gmail.com', 'Chennai Institute of Technology', 'Student', 'Hackathon'),
  mk('Savitha R', 'savithar.cse2024@citchennai.net', 'Chennai institute of technology', 'Student', 'Hackathon'),
  mk('SIVABALAN M', 'muthusivabalan2007@gmail.com', 'Saveetha Engineering college', 'Undergraduate', 'Hackathon'),
  mk('Sujeet Singh', 'sujeetsingh121696@gmail.com', 'Toast, Inc.', 'Software Engineer II', 'Hackathon'),
  mk('Tanvi Chelamkuri', 'tanvichelamkuri@gmail.com', 'Amrita Vishwa Vidhyapeetam Bangalore', 'Student', 'Hackathon'),
  mk('Tanya Goel', 'goeltanya01@gmail.com', 'American Express', 'Product Manager', 'Hackathon'),
  mk('Thanushree Vijayakanth', 'thanushreevijayakanth@gmail.com', 'Saveetha Engineering College', 'Student - BE CSE IOT 3rd yr', 'Hackathon'),
  mk('Vinay G', 'vinayg1752004@gmail.com', 'Presidency University', 'Student', 'Hackathon'),

  // ── VIP ─────────────────────────────────────────────────────────────────
  mk('Aishwarya Thilak', 'aishwarya.thilak@freshworks.com', 'Freshworks', 'Manager, OB', 'VIP'),
  mk('Anish Raghavendra', 'anish.raghavendra@freshworks.com', 'Freshworks', 'Software Engineer - Systems', 'VIP'),
  mk('Ankitha Harinath', 'ankitha.harinath@freshworks.com', 'Freshworks', 'Staff Product Manager', 'VIP'),
  mk('Arya K Nair', 'arya.k@wework.co.in', 'WeWork India Management Ltd', 'Head of Product and Design', 'VIP'),
  mk('Ashwin Srinivasan', 'ashwin.srinivasan@moengage.com', 'Moengage', 'VP, Product', 'VIP'),
  mk('Ayushi Marhia', 'ayushi.marhia@inmobi.com', 'Glance', 'Global Founder comms', 'VIP'),
  mk('Balaji Bhanu', 'balaji.07.bolla@gmail.com', 'Ellucian', 'Associate Product Manager', 'VIP'),
  mk('Bindisha Sarang', 'bindisha.sarang@gmail.com', 'Adfactors PR', 'Senior Account Director', 'VIP'),
  mk('Caleb Matthew Friesen', 'caleb@odyssey.build', 'Odyssey / RuntimeBRT', 'Content Creator', 'VIP'),
  mk('Dipali Dubey', 'dipali.dubey@silverminegroup.com', 'Silvermine Group', 'Director - Product', 'VIP'),
  mk('Divvya Sriram', 'divvya.sriram@freshworks.com', 'Freshworks', 'Senior Staff Product Manager', 'VIP'),
  mk('Dominic Periera', 'dominic.pereira@automationanywhere.com', 'Automation Anywhere', 'VP, Product & India Site lead', 'VIP'),
  mk('Dr. S. Senthil', 'dean-sca@dsu.edu.in', 'Dayananda Sagar University', 'Professor and Dean', 'VIP'),
  mk('Gaurav Gupta', 'gaurav.gupta1@freshworks.com', 'Freshworks', 'Distinguished Engineer', 'VIP'),
  mk('Gokul Surendran', 'gokul.surendran@wissen.com', 'Wissen Technology Pvt Ltd', 'Associate Director', 'VIP'),
  mk('Gopinath Shunmuganathan', 'gopinath.shanmugam@ctr.freshworks.com', 'Freshworks', 'PM Mentor', 'VIP'),
  mk('Harati Kappari', 'harati.kappari@freshworks.com', 'Freshworks', 'Director of Engineering', 'VIP'),
  mk('Himanshu Singhal', 'himanshu.singhal@freshworks.com', 'Freshworks', 'Mentor', 'VIP'),
  mk('Jim Mathew Kochitty', 'jimmathew.kochitty@freshworks.com', 'Freshworks', 'Senior Manager, Product Management', 'VIP'),
  mk('Karteek Mamidanna', 'karteek.mamidanna@freshworks.com', 'Freshworks', 'Staff Product Manager', 'VIP'),
  mk('Karthik S Rao', 'karthik.rao@wissen.com', 'Wissen Technology Pvt Ltd', 'Executive Director', 'VIP'),
  mk('Kaushal Cavale', 'kaushal.cavale@freshworks.com', 'Freshworks', 'Senior Principal Engineer', 'VIP'),
  mk('Krithika Manohar', 'krithika.manohar@freshworks.com', 'Freshworks', 'Senior Director - Product Management', 'VIP'),
  mk('Kumud Acharya', 'kumudacharya2000@gmail.com', 'LenDenClub', 'Product Manager', 'VIP'),
  mk('Lavanya Karunakaran', 'lavanya.karunakaran@gmail.com', 'Light And Wonder iGaming', 'Deputy Director, Product Management', 'VIP'),
  mk('Manavi Singh', 'singhmanavi12@gmail.com', 'Kite', 'Product Manager', 'VIP'),
  mk('Meenakshi Subramanian', 'smeena06@gmail.com', 'Optum', 'Product Leader', 'VIP'),
  mk('Mohideen Ibrahim', 'mohideen.ibrahim@freshworks.com', 'Freshworks', 'Staff Engineer - Freshworks', 'VIP'),
  mk('Mohith Maddineni', 'mohith.maddineni@freshworks.com', 'Freshworks', 'Product Manager', 'VIP'),
  mk('Mrunalini Palakurthi', 'pmrunalini@gmail.com', 'Ellucian', 'Product Manager', 'VIP'),
  mk('Neha Bangar', 'neha.bangar@gmail.com', 'Adobe', 'Principal Project Manager', 'VIP'),
  mk('Pallavi Bhowmick', 'pallavi.g.bhowmick@accenture.com', 'Accenture', 'Managing Director', 'VIP'),
  mk('Pragadeesh K', 'pragadeesh.k@freshworks.com', 'Freshworks', 'Mentor (Lead Software Engineer- Platforms)', 'VIP'),
  mk('Prakshi Bajaj', 'prakshi.bajaj@wissen.com', 'Wissen Technology Private Limited', 'Senior Solution Designer', 'VIP'),
  mk('Priyanka Mahadev', 'priya1687@gmail.com', 'ICON plc', 'Business Analyst', 'VIP'),
  mk('Radha Shreeniwas', 'radha.shreeniwas@freshworks.com', 'Freshworks', 'VP Global HRBP', 'VIP'),
  mk('Rahul RP', 'rahul.prakash@freshworks.com', 'Freshworks', 'Mentor', 'VIP'),
  mk('Rajiv Gopal', 'rajiv_iyengar@hotmail.com', 'WIT India', 'Logistics Lead', 'VIP'),
  mk('Rupesh Kumar', 'rupesh.kumar@wework.co.in', 'WeWork India Management Ltd', 'Chief Product and Technology Officer', 'VIP'),
  mk('Sandeep Balaji', 'sandeep@incrementumx.com', 'IncX', 'Founder', 'VIP'),
  mk('Shalini Chandrasekharan', 'shalini.chandrasekharan@freshworks.com', 'Freshworks', 'Manager - Internal Comms & Experience', 'VIP'),
  mk('Shivasharan Manivannan', 'shivasharan.m@zohocorp.com', 'Zoho', 'Product Marketing Manager', 'VIP'),
  mk('Shrinivas Chouraddi', 'shrinivas@valuecart.in', 'Valuecart Pvt Ltd', 'VP Technology', 'VIP'),
  mk('Sobhitha Neelanath', 'sneelanath@salesforce.com', 'Salesforce', 'Senior Manager Software Engineering', 'VIP'),
  mk('Srinivasu Chakravarthula', 'srinivasu.chakravarthula@freshworks.com', 'Freshworks', 'Director of Accessibility', 'VIP'),
  mk('Srivatsan Rangan', 'srivatsan.rangan@freshworks.com', 'Freshworks', 'Sr Director Product Mgmt', 'VIP'),
  mk('Suchint Karnatak', 'suchint@pokonut.com', 'Pokonut', 'CEO', 'VIP'),
  mk('Sumit Dutta', 'sumit@unwindventures.com', 'Unwind Ventures', 'Managing Partner', 'VIP'),
  mk('Swathi Yerram', 'swathi.yerram@freshworks.com', 'Freshworks', 'Mentor', 'VIP'),
  mk('Swati Sharma', 'swati.sharma8621@gmail.com', 'Ellucian India', 'Senior Product Manager', 'VIP'),
  mk('Yash Vahi', 'yash.vahi@gmail.com', 'Artus AI', 'Co-founder & CEO', 'VIP'),

  // ── Premium ─────────────────────────────────────────────────────────────────
  mk('Aditya Sonthalia', 'adityasonthalia14@gmail.com', 'eBay', 'Senior Product Manager', 'Premium'),
  mk('Akshay Balakrishnan', 'akbgunner4ever@gmail.com', 'Accenture Strategy and Consulting', 'Management Consultant', 'Premium'),
  mk('Angel Walia', 'anwalia@ebay.com', 'eBay', 'Product Manager', 'Premium'),
  mk('Anusha Venkatasubramanian', 'anushavenkat@salesforce.com', 'Salesforce', 'Director of Product', 'Premium'),
  mk('Aparna Srinivasan', 'aparnas@adobe.com', 'Adobe', 'Account Executive', 'Premium'),
  mk('Archana Sinha', 'archanas.connect@gmail.com', 'Ex- Greenway Health', 'Product Manager', 'Premium'),
  mk('Deepika Verma', 'deepikaverma.pm@gmail.com', 'Insight Software', 'Product Manager', 'Premium'),
  mk('Durgaprasad Balakuntla', 'durgaprasad.balakuntla@wissen.com', 'Wissen Technology Pvt Ltd', 'Senior Director', 'Premium'),
  mk('Gaurav Diwan', 'gdiwan@ebay.com', 'Ebay', 'Senior Product Manager', 'Premium'),
  mk('Gaurav Sharma', 'gaurav.sharma@toasttab.com', 'Toast', 'Senior Software Engineer', 'Premium'),
  mk('Gurarpit Kaur', 'gurarpitkaur3398@gmail.com', 'GE Aerospace', 'Product Manager', 'Premium'),
  mk('Hardik Sharma', 'hardik.sharma@toasttab.com', 'Toast', 'Senior Software Engineer', 'Premium'),
  mk('Harshita Sodani', 'harshita25sodani@gmail.com', 'Optum', 'Product Manager', 'Premium'),
  mk('Hema Jayprakash', 'hemah3@gmail.com', 'Deephealth', 'Senior Architect', 'Premium'),
  mk('Jyothi Hallikeri', 'jyothi.hallikeri2@gmail.com', 'ZeroFox', 'Technical Product Manager', 'Premium'),
  mk('Kapil K', 'kapil7k@outlook.com', 'Talentship', 'Product Owner', 'Premium'),
  mk('Karuna Kukreja', 'karuna.kukreja@toasttab.com', 'Toast', 'Senior Software Engineer', 'Premium'),
  mk('Lalit Shewani', 'lalit.shewani01@gmail.com', 'Ford Motor Company', 'Senior Product Manager', 'Premium'),
  mk('Lubna Thabseem', 'thabseem@deloitte.com', 'Deloitte', 'Product Manager', 'Premium'),
  mk('Madhushree', 'findmadhu.roy@gmail.com', 'Mastercard', 'Director, Mastercard', 'Premium'),
  mk('Mr. Chinnakkani Ayyasamy.', 'chinnakkani.ayyasamy@wissen.com', 'Wissen Technology Pvt Ltd', 'Executive Director', 'Premium'),
  mk('Mrudula Jonnavithula', 'mrudula.jonnavithula@gmail.com', 'Walmart', 'Senior Engineering Manager', 'Premium'),
  mk('Nidhi Shreya', 'nidhishreya@gmail.com', 'Simpplr', 'Principal PM', 'Premium'),
  mk('Poorvaja Sadasivam', 'poorvaja.sadasivam@gmail.com', 'Verizon', 'Senior Manager', 'Premium'),
  mk('Prerna Bansal', 'prernaba@gmail.com', 'Adobe', 'Senior Security Engineer', 'Premium'),
  mk('Raghunath Sajeev', 'raghusajeev1994@gmail.com', 'Ellucian', 'Product Manager', 'Premium'),
  mk('Rajalaksmi Sankarlingam', 'ajalaksmi.sankar.work@gmail.com', 'Delloite', 'Product Manager', 'Premium'),
  mk('Rituparna Haldar', 'rhalder197@gmail.com', 'Accenture', 'Product Marketing', 'Premium'),
  mk('Saba Khalili', 'sakhalili@deloitte.com', 'Delloite', 'Product Manager', 'Premium'),
  mk('Sai Keerthana Srinivasan', 'ssai.keerthana@gmail.com', 'Docusign', 'Lead Product Designer', 'Premium'),
  mk('Saloni Sarkar', 'salsarkar@deloitte.com', 'Delloite', 'Product Specialist', 'Premium'),
  mk('Sathiya Prakash', 'sathiym@ebay.com', 'eBay', 'Product Manager - 3', 'Premium'),
  mk('Satya Sri Dharmika', 'satyasrikanakala@gmail.com', 'Novi', 'Co Founder', 'Premium'),
  mk('Saurav M', 'ksauravmahato@deloitte.com', 'Delloite', 'Product Specialist', 'Premium'),
  mk('Shalini Singh', 'shalinitsingh28@gmail.com', 'Publicis Re:Sources', 'Senior Associate Agentic AI/ AI Engineer', 'Premium'),
  mk('Sheethal Ann George', 'sheethalg@gmail.com', 'Adobe', '', 'Premium'),
  mk('Shimona Bordia', 'shimona.bordia@target.com', 'Target', 'Product', 'Premium'),
  mk('Shobha Rani Basavaraj', 'sbasavar@adobe.com', 'Adobe Systems India Pvt Lyd', 'Group Manager - Americas Consulting', 'Premium'),
  mk('Shraddha Vimal', 'shraddha.vimal@target.com', 'Target', 'Sr Product Manager', 'Premium'),
  mk('Shruti Anand', 'shruthianand0603@gmail.com', 'Freelance', 'Independent Architect', 'Premium'),
  mk('Sid Shrivastava', 'sidshrivastava@deloitte.com', 'Delloite', 'Product Manager', 'Premium'),
  mk('sireeshasur', 'sireeshasur@gmail.com', 'Haleon', 'Product Leader', 'Premium'),
  mk('Sri Harsha', 'connect.ksriharsha@gmail.com', 'Flexera', 'Product Manager', 'Premium'),
  mk('Suchitra Ravichander', 'suchitraravichander@gmail.com', 'Comcast', 'Senior Product Manager', 'Premium'),
  mk('Sumit Pal', 'sumit.pal@iiml.org', 'eBay', 'Senior Product Manager', 'Premium'),
  mk('Swati Suresh', 'swathis@adobe.com', 'Adobe', 'Computer Scientist II', 'Premium'),
  mk('Swati Tiwari', 'tiwari.swati11@gmail.com', 'Elanco', 'Product Manager', 'Premium'),
  mk('Tushar Khandelwal', 'tushar.khandelwal@toasttab.com', 'Toast', 'Software Engineer 2', 'Premium'),
  mk('Urvashi Kodwani', 'kodwaniurvashi@gmail.com', 'Adobe', 'Tech Lead', 'Premium'),
  mk('Vaibhav Gupta', 'vaibhgupta@ebay.com', 'eBay', 'Senior Product Manager', 'Premium'),
  mk('Vardhan Jain', 'vardhan.jain@payu.in', 'PayU', 'Director, Product Growth and Strategy, and Chief of Staff, CPO', 'Premium'),
  mk('Vidhi Mittal', 'mittalvidhi130@gmail.com', 'Adobe', 'Software Developer 2', 'Premium'),
  mk('Viswajith Vishnusai', 'viswajithvishnusai@gmail.com', 'MBA', 'Amrita School Of Buisness', 'Premium'),
  mk('Yugansh Aggarwal', 'yugansh20@gmail.com', 'Google', 'Senior Software Engineer', 'Premium'),

  // ── General ─────────────────────────────────────────────────────────────────
  mk('Aarati Mankar', 'aarati.mankar@gmail.com', 'TensorN', 'Founder', 'General'),
  mk('Aayesha Mishra', 'aayeshamishranitw@gmail.com', '', '', 'General'),
  mk('Aayushi Gupta', 'aayushi@superbryn.com', '', '', 'General'),
  mk('Abhijeet Yadav', 'abhijeety.c@anitab.org', '', '', 'General'),
  mk('Abhinav Gandotra', 'agandotra@microsoft.com', 'Microsoft', 'Senior AI PM', 'General'),
  mk('Abhinav Lalam', 'abhinav.lalam@gobblecube.ai', 'Gobblecube', 'Associate Director - Analytics', 'General'),
  mk('Adarsh Manikandan', 'adarshm@sprinto.com', 'Sprinto', 'Product Manager', 'General'),
  mk('Aditi Jain', 'aditi.jain@walmart.com', '', '', 'General'),
  mk('Aditi Rajesh', 'aditirajesh1234@gmail.com', 'Hashfame', 'Product Manager', 'General'),
  mk('Aishwarya Varadarajan', 'aish.varad@gmail.com', 'Airbnb', 'Product Manager', 'General'),
  mk('Ajeet Pandey', 'ajeet.pandey@freshworks.com', 'Freshworks', 'Lead Software Engineer', 'General'),
  mk('Akash Prusty', 'akashpnith@gmail.com', '', '', 'General'),
  mk('Akshay Nandwana', 'akshay.nandwana@agora.io', 'Agora', 'Developer Advocate', 'General'),
  mk('Akshyee Bhadrawal', 'abhadrawal@clickup.com', 'Clickup', 'Senior Analyst', 'General'),
  mk('Al Ameen', 'al.ameen@freshworks.com', 'Freshworks', 'Lead - Customer Success Engineer', 'General'),
  mk('Aman Gour', 'amangour88@gmail.com', '', '', 'General'),
  mk('Amarnath Chavva', 'amarnath.chavva@automationanywhere.com', 'Automation Anywhere', 'Principal Product Manager', 'General'),
  mk('Ambar Dange', 'dange.ambar@gmail.com', 'Agilitas Sports', 'Product Lead', 'General'),
  mk('Amit Navare', 'amit@coverdoc.ai', 'Nirnay Labs', 'Founder/Co-Founder', 'General'),
  mk('Anagaha Suchitra', 'anagha.s.08@gmail.com', 'Intuit', 'Senior Product Manager', 'General'),
  mk('Anand TV', 'anand.tv@freshworks.com', 'Freshworks', 'Engineering Manager', 'General'),
  mk('Anchal Garg', 'anchalgarg1995@gmail.com', 'Arintra', 'Senior AI Product Manager', 'General'),
  mk('Aniruddha Mandal', 'aniruddha@webzero.ai', 'WebZero', 'Founding Engineer', 'General'),
  mk('Anirudh Sareen', 'anirudh.sareen@freshworks.com', 'Freshworks', 'Staff Product Manager', 'General'),
  mk('Ankit Ambasht', 'ankit.ambasht@tcs.com', 'TCS', 'Product Manager', 'General'),
  mk('Ankit Srivastava', 'ankit.srivastava@freshworks.com', 'Freshworks', 'Senior Staff Engineer', 'General'),
  mk('Ankita Rawat', 'ankita.rawat@freshworks.com', 'Freshworks', 'Senior Product Manager', 'General'),
  mk('Ankur Joshi', 'ankur.joshi@clearroute.io', 'ClearRoute', 'Senior Engineer', 'General'),
  mk('Ankush Sharma', 'ankush.sharma@toasttab.com', 'Toast', 'Engineering Manager', 'General'),
  mk('Anmol Kala', 'anmol.kala@murf.ai', 'Murf AI', 'Sales Development Representetive', 'General'),
  mk('Annam Pavan Raaj', 'annam.pavanraaj@freshworks.com', 'Freshworks', 'Software Engineer - Backend', 'General'),
  mk('Anshul Yadav', 'anshulyadav1968@gmail.com', '', '', 'General'),
  mk('Anuja Mehta', 'anuja216@gmail.com', 'Uncommon Labs', 'Founder/CEO', 'General'),
  mk('Anuraag Ravi', 'anuraag.ravi@toasttab.com', 'Toast', 'Senior Customer Care Specialist', 'General'),
  mk('Anuradha Dwarakanath', 'anukolar@gmail.com', 'Lam Research', 'Sr Staff Technical Program Manager', 'General'),
  mk('Anushka Seth', 'anushka.seth@ibm.com', '', '', 'General'),
  mk('Anwesha Bangabash', 'anwesha.bangabash@flipkart.com', '', '', 'General'),
  mk('Apala Bhatt', 'apalabhatt74@gmail.com', 'Oracle', 'Software Developer', 'General'),
  mk('Aparna TA', 'aparnata@gmail.com', 'Zoho', 'Product Program Manager', 'General'),
  mk('Appanna Prakash', 'appanna.prakash@ibm.com', 'IBM', '', 'General'),
  mk('Apurva Nitanjay', 'apuayush@gmail.com', 'Genesis Global', 'Senior Software Engineer', 'General'),
  mk('Arpit Bhargava', 'arpit.bhargava@freshworks.com', '91.98111006', 'Freshworks', 'General'),
  mk('Arpita Behura', 'arpitabehura186@gmail.com', '', '', 'General'),
  mk('Arthi Vinod', 'arthivinod28@gmail.com', 'Employ', 'Product Manager', 'General'),
  mk('Arun Antony Augustine', 'arun@gistr.so', 'Gistr', 'CEO', 'General'),
  mk('Arun Dhanasekaran', 'arunprakash.dhanasekaran@freshworks.com', 'Freshworks', 'Manager - Product Management', 'General'),
  mk('Arun Mudaliar', 'arun.mudaliar@automationanywhere.com', 'Automation Anywhere', 'Principal Product Manager', 'General'),
  mk('Arunima', 'arunima@webzero.ai', 'Webzero', 'Founder, CEO', 'General'),
  mk('Arvind Anuram', 'arvind@ardivent.com', 'Ardivent', 'Founder', 'General'),
  mk('Ashish Goyal', 'ashisharsh2022@gmail.com', 'ThriveX Studios', 'Co Founder', 'General'),
  mk('Ashokkumar Nagarajan', 'ashokkumar.nagarajan@freshworks.com', 'Freshworks', 'Senior Manager - Product Design', 'General'),
  mk('Ashutosh  Poddar', 'ashpd21@gmail.com', 'Jio Platforms', '', 'General'),
  mk('Atreyi Bose', 'atreyi.ai@gmail.com', 'AccelData', 'Director Customer Success', 'General'),
  mk('Atul Mishra', 'atulmishraiec@gmail.com', 'Allen Career Institute', 'HOD', 'General'),
  mk('Atul Pal', 'atul@vobiz.ai', 'Vobiz AI', 'Director, Growth', 'General'),
  mk('Avantika Garg', 'avantikagarg007@gmail.com', 'Noon', 'Associate Director of Product', 'General'),
  mk('Avni Gupta', 'avni.gupta@freshworks.com', 'Freshworks', 'Senior Software Engineer', 'General'),
  mk('Ayush Awasthi', 'ayush@vaaniresearch.com', 'Vaani Research Labs', 'Forward Deployed Engineer', 'General'),
  mk('Bharathi  Sridharan', 'bsrid@amazon.com', '', '', 'General'),
  mk('Bhavya Singh', 'bhavya@vaaniresearch.com', 'Vaani AI Research', 'GTM and Revenue Operations', 'General'),
  mk('Chanakya Varma', 'chanakya.varma@dataart.com', 'DataArt', 'Forward Deployed Solutions Leader', 'General'),
  mk('Chandini Rajput', 'chandini.rajput@dataart.com', 'DataArt Technologies Pvt Ltd', 'Workplace Manager', 'General'),
  mk('Chandra Nudurupati', 'chandra@hiringeye.com', 'Hiring eye', 'Recruitment Advisor', 'General'),
  mk('Chandrashekran Y', 'chandra@vaaniresearch.com', 'Vaani AI Research Labs', 'Founder\'s Office', 'General'),
  mk('Chintan Shah', 'chintshah.91@gmail.com', 'Future AGI', 'Product', 'General'),
  mk('Chirag Shenoy', 'chirag.shenoy@phonepe.com', 'PhonePe', 'Engineering Manager', 'General'),
  mk('D.KANAKAREDDY', 'kanakareddy.d@wipro.com', 'ARCHITECT', 'WIPRO', 'General'),
  mk('Darshan Krishna N', 'darshan.krishna@jll.com', 'JLL Technologies', 'Data Analyst', 'General'),
  mk('Deepali Lalwani', 'deepali@vobiz.ai', 'Vobiz AI', 'Head of Brand & Marketing', 'General'),
  mk('Devadarshini Elango', 'edevadarshini@gmail.com', 'Chennai Institute of Technology', 'Student', 'General'),
  mk('Devansh Tripathi', 'devansh@superbryn.com', '', '', 'General'),
  mk('Devanshi Choudhary', 'devanshi.choudhary@walmart.com', 'Walmart', 'Director of Engineering', 'General'),
  mk('Dhaarini Vijay', 'dhaarini.vijay@paytm.com', 'Paytm', 'Sr Director of Product', 'General'),
  mk('Dharmik Nitin', 'dharmik@hiringeye.com', 'Hiring eye', '', 'General'),
  mk('Dhruvam Upadhyay', 'udhruvam@gmail.com', 'krowdkraft', 'Student', 'General'),
  mk('Diana Panda', 'diapanda@gmail.com', 'PayPal', 'Lead Product Manager', 'General'),
  mk('Dipayan Ghatak', 'dipayan.ghatak@walmart.com', 'Walmart', 'Senior Manager', 'General'),
  mk('Ditto mohan', 'ceo@biogrithm.com', 'Founder / CTO', 'Biogrithm, Bengaluru health community, Bengaluru tech community.', 'General'),
  mk('Divya', 'divya@dfourpower.com', 'D4powerzee technologies Pvt Ltd', 'Founder', 'General'),
  mk('Divya Chandrabhanu', 'divya.chandrabhanu@hrblock.com', 'H&R Block India Private Limited', 'Product Manager', 'General'),
  mk('Diya Vijay', 'diyavijay2371@gmail.com', '', '', 'General'),
  mk('Dr. P. Penchala Prasad', 'prasadcseds@rgmcet.edu.in', 'Rajeev Gandhi Memorial College of Engineering and Technology', 'Associate Professor', 'General'),
  mk('Ekta Mishra', 'ekta.mishra@freshworks.com', 'Freshworks', 'Product Manager', 'General'),
  mk('Eshika Mahajan', 'eshikamahajan21@gmail.com', 'Optum AI', 'AI ML Engineer', 'General'),
  mk('Fauzan Jiteker', 'mjitekar@lululemon.com', 'lululemon', 'Product Manager', 'General'),
  mk('Gangavarapu Vikram Chandra', 'vikramcseds@rgmcet.edu.in', 'Rajeev Gandhi Memorial College of Engineering and Technology', 'Assistant Professor', 'General'),
  mk('Gaurav Madaan', 'gaurav.madaan@freshworks.com', 'Freshworks', 'Manager Product Analytics', 'General'),
  mk('Gaurav Sukumar', 'gaurav.sukumar@murf.ai', 'Murf AI', 'Global Enterprise Sales Manager', 'General'),
  mk('Gautam Mahesh', 'gautam.mahesh@paytm.com', 'Paytm', 'AVP of Product', 'General'),
  mk('George C J', 'george.jos@freshworks.com', 'Freshworks', 'Senior Staff Engineer', 'General'),
  mk('Glory Michael', 'glory.michael@dataart.com', 'DataArt', 'Sales and Revenue Growth Manager', 'General'),
  mk('Godugu Veena', '23091a32h9@rgmcet.edu.in', 'Rajeev Gandhi Memorial College of Engineering and Technology', 'Undergraduate Student', 'General'),
  mk('Gouthami Kristam', 'gouthamicsg@gmail.com', 'Cloud Software Group', 'Lead Software Engineer', 'General'),
  mk('Gyan Anjay', 'anjaygyan@gmail.com', 'OneTrust', 'Senior Product Manager', 'General'),
  mk('Hani Harrise', 'hani.harrise@freshworks.com', 'Freshworks', 'Customer Success Specialist', 'General'),
  mk('Harmeet Singh', 'harmeetsingh.chawla@freshworks.com', 'Freshworks', 'Staff Product Manager', 'General'),
  mk('Himanshu Sharma', 'himanshu.sharma@freshworks.com', 'Freshworks', 'Lead Software Engineer - Systems', 'General'),
  mk('Hrishikesh', 'hrishikesh.balakrishnan@freshworks.com', 'Freshworks', 'Lead software engineer', 'General'),
  mk('Ilamthendral Gajendran', 'ilamthendralgajendran@gmail.com', 'Probeplus Innovative Solutions Pvt. Ltd', 'Senior Product Manager', 'General'),
  mk('Iptisha Gupta', 'iptishagupta@gmail.com', '', '', 'General'),
  mk('Jagadish Vinjamuri', 'jagadish.vinjamuri@toasttab.com', 'Toast', 'Senior Product Manager', 'General'),
  mk('Jahnvi Bedia', 'jahnvibedia.28@ibm.com', '', '', 'General'),
  mk('Jyotsna Guduguntla', 'jyotsnad@sprinto.com', 'Sprinto', 'Product Manager', 'General'),
  mk('Kailash Ahirwar', 'kailash@levit8labs.in', 'Levit8 Labs', 'Founder & CEO', 'General'),
  mk('Kalpana Kempanna', 'kalpanak.ravikumar@gmail.com', '', '', 'General'),
  mk('Kalyanaraman', 'kalyan@basedynamics.com', 'BaseDynamics Inc', 'Cofounder & CEO', 'General'),
  mk('Karamjot Singh', 'karamjot.singh@freshworks.com', 'Freshworks', 'Lead Software Engineer', 'General'),
  mk('Kartheek Dama', 'dama.kartheek@accenture.com', 'Accenture Solutions pvt ltd', 'Advanced App Engineering Associate', 'General'),
  mk('Kavya Joseph', 'kavyajoseph@microsoft.com', 'Microsoft', 'Senior Product Manager Lead', 'General'),
  mk('Kheem Dhanik', 'kheemchandrasingh@gmail.com', 'UrbanPiper', 'Platform Support Engineer', 'General'),
  mk('Khushbu Kamal', 'khushbu.kamal@ibm.com', '', '', 'General'),
  mk('Khyaati Jindal', 'khyaatijindal2000@gmail.com', 'Apple tech', 'AI Engineer', 'General'),
  mk('Kiran Shivanandan', 'kirankumar.s@freshworks.com', 'Freshworks', 'Senior Principle Engineer', 'General'),
  mk('Krishna N Mehta', 'krimehta@visa.com', 'Visa Inc', 'Senior software engineer', 'General'),
  mk('Kritika Singh', 'kritika@dazeinfo.com', 'Dazeinfo Media and Research', 'Growth Executive', 'General'),
  mk('Kumar Keshav', 'kumar.keshav@freshworks.com', 'Freshworks', 'Manager Analytics', 'General'),
  mk('Kumar Krishanjeet', 'kumar.krishanjeet@freshworks.com', 'Freshworks', 'Corporate Strategy Manager', 'General'),
  mk('Kunal Kotak', 'kunalkotak9@gmail.com', '', '', 'General'),
  mk('Kushagr Khera', 'kushkhera@theattire.ai', 'Attire.ai', 'Founder', 'General'),
  mk('Lasya Kuppa', 'lasyakuppa@gmail.com', 'Realpage', 'Principal Product Manager', 'General'),
  mk('Lokesh Goel', 'lokesh.goel@toasttab.com', 'Toast', 'Software Engineer', 'General'),
  mk('Madhuparna Dutta', 'md.dutta.10@gmail.com', '', '', 'General'),
  mk('Mahesh Kataria', 'mahesh.kataria@hrblock.com', 'H&R Block India Private Limited', 'Senior Product Manager', 'General'),
  mk('Mahi Monga', 'mahimonga04@gmail.com', 'Sprinklr', 'AI Product Manager', 'General'),
  mk('Malathesh MG', 'mgsmalathesh@gmail.com', 'Societe Generale', 'Senior Product Owner', 'General'),
  mk('Malthi SS', 'malthi@sparkprod.in', 'SparkProd Consulting', 'Product Executive', 'General'),
  mk('Manasa Kalaimalai', 'manasastyles@gmail.com', '', '', 'General'),
  mk('Manik Singhal', 'manik@vaaniresearch.com', 'Vaani Research Labs', 'DevOps Engineer', 'General'),
  mk('Manish S Sugandhi', 'manish@noon.design', 'Noon', 'Product', 'General'),
  mk('Manju Bhagtani', 'mbhagtani@microsoft.com', 'Microsoft', 'Software Engineer 2', 'General'),
  mk('Manoj Ponnusamy', 'manoj.ponnusamy@dataart.com', 'DataArt India', 'Director, Account Management', 'General'),
  mk('Martin Gasser', 'martin_gasser@bluewin.ch', 'Coaching4Leaders', 'Leadership-Coach', 'General'),
  mk('Mayanka Sumanth', 'mayanka148@gmail.com', '', '', 'General'),
  mk('Meet Mehta', 'meet.yogeshbhaimehta@freshworks.com', 'Freshworks', 'Senior Demo Engineer', 'General'),
  mk('Meghana Swethadri', 'smeghana@lululemon.com', 'Lululemon', '', 'General'),
  mk('MGM Manjunath', 'manju@vaaniresearch.com', 'Vaani AI Research', 'Founding CS Manager', 'General'),
  mk('Mitali Dubey', 'dubey.mitali90@gmail.com', 'Dell', '', 'General'),
  mk('Mohamed Siddique', 'mohamed@userorb.com', 'Userorbit', 'Growth & GTM Lead', 'General'),
  mk('Mohamed Yusuf Kadhar', 'mohamed.yusufkadhar@freshworks.com', 'Freshworks', 'Senior Software Engineer - Backend', 'General'),
  mk('Mohammad Palla', 'mohammad@vaaniresearch.com', 'Vaani Research Labs', 'Founding Engineer', 'General'),
  mk('Mohammed Jaffar', 'ugcet2401014@reva.edu.in', 'Reva University', 'Student', 'General'),
  mk('Mohan Gola', 'mohangola47@gmail.com', 'Senior developer', 'Bengaluru Tech Community', 'General'),
  mk('Monalisa Mahapatra', 'monalisa.mahapatra@clearroute.io', 'ClearRoute', 'Senior Engineer', 'General'),
  mk('Monica Singh', 'monica.singh@salesforce.com', '', '', 'General'),
  mk('Mudrika C', 'mudrika@google.com', 'Google', 'Product Manager', 'General'),
  mk('Mukesh KR', 'codejets@gmail.com', 'Userorbit', 'Founder', 'General'),
  mk('Muskan Gupta', 'guptamuskan1798@gmail.com', '', '', 'General'),
  mk('Nandini Jani', 'nandinibytes@gmail.com', 'Supervity', 'Jr Product Marketing Manager', 'General'),
  mk('Nazre Aalam Rafeez J', 'nazreaalam.rafeez@freshworks.com', 'Freshworks', 'Customer Success Manager', 'General'),
  mk('Neel kumar', 'neelkumar.bodanki@freshworks.com', 'Freshworks', 'Manager - Pricing strategy', 'General'),
  mk('Neha Gupta', 'gargneha@microsoft.com', 'Microsoft', 'Partner PM', 'General'),
  mk('Neha Nadiger', 'nehanadigerwork@gmail.com', 'Unimad', 'Product Manager', 'General'),
  mk('Neha Priya', 'nehapr92@gmail.com', 'TPH', 'AI PM', 'General'),
  mk('Neha Sapru', 'neha.sapru@automationanywhere.com', 'Automation Anywhere', 'Principal Product Manager', 'General'),
  mk('Nency Shah', 'nency.shah@healthedge.com', 'HealthEdge', 'Product Manager', 'General'),
  mk('Nidhi Bartakke', 'nidhibartakke@gmail.com', 'Target', 'Sr Data Analyst', 'General'),
  mk('Nikhil Mankar', 'nikhilpmankar@gmail.com', 'BD', 'Lead Engineer- Medical Devices R&D', 'General'),
  mk('Nikhil Sharma', 'snikhil@athenahealth.com', 'Athenahealth', 'Sr Product Manager', 'General'),
  mk('Nikita Bastian', 'nickybastian67@gmail.com', 'Akamai Technologies', 'Product Owner', 'General'),
  mk('Nimish Beriwal', 'nimish@glib.ai', 'Genesis Artificial Intelligence Private Limited', 'Product Manager', 'General'),
  mk('Ninkesh Neema', 'ninkesh5@gmail.com', '', '', 'General'),
  mk('Nirmal Packirisamy', 'nirmal.packirisamy@freshworks.com', 'Freshworks', 'Lead Software Engineer', 'General'),
  mk('Nisha Chandrasekaran', 'nishac0506@gmail.com', 'Previously Intuit', 'Senior Product Designer', 'General'),
  mk('Nishank Gupta', 'nishank.gupta@freshworks.com', 'Freshworks', 'Sr. Director, CX Program Excellence', 'General'),
  mk('Nishant Sinha', 'nisan@amazon.com', 'Amazon', 'Sr AI PM', 'General'),
  mk('Nitya Samavedam', 'nityaksam02@gmail.com', 'Fwdslash AI', 'Product Manager', 'General'),
  mk('P K Jain', 'pkjain@idehost.com', 'PanelReady', 'CTO', 'General'),
  mk('Palak Jadwani', 'palak.jadwani@flipkart.com', '', '', 'General'),
  mk('Pallavi Balasubramanya', 'pallavi.subramanya@gmail.com', 'Deloitte', 'Product Manager', 'General'),
  mk('Pallavi Ghadyalpatil', 'pallavi@nuvikatech.com', 'Nuvika Technologies', 'Director Growth and Delivery', 'General'),
  mk('Paramesh T V', 'paramesh.tadasuruvasantakumar@freshworks.com', 'Freshworks', 'Senior product manager', 'General'),
  mk('Parth Jain', 'parth@superbryn.com', 'SuperBryn', 'Head Product Growth', 'General'),
  mk('Parth Mehta', 'parth.mehta2801@gmail.com', 'KrowdKraft', 'Student', 'General'),
  mk('Piyush Sahoo', 'piyush@vobiz.ai', 'Vobiz AI', 'Founding member', 'General'),
  mk('Pooja Sridhar', 'pooja.sridhar@freshworks.com', 'Freshworks', 'Lead software engineer', 'General'),
  mk('Prachi Rai', 'prachi.rai@glib.ai', '', '', 'General'),
  mk('Pradhyuman Shaktawat', 'pradhyumansingh575@gmail.com', '', '', 'General'),
  mk('Pragya Ananth', 'pragya.ananth@gmail.com', 'Bosch', 'Forward Deployed Engineer', 'General'),
  mk('Pragya Shahi', 'pragya.shahi@freshworks.com', 'Freshworks', 'Lead Cloud Security', 'General'),
  mk('Pramod Muralimohan', 'pramod.muralimohan@mercedes-benz.com', 'Mercedes-Benz Research and Development India Private Limited', 'Lead Data Scientist', 'General'),
  mk('Pranalika Mahanta', 'pranalikam.c@anitab.org', '', '', 'General'),
  mk('Pranav Kumar Singh', 'pranavkumar.singh@freshworks.com', 'Freshworks', 'Staff product manger', 'General'),
  mk('Pranav Mehra', 'pranav.mehra@freshworks.com', 'Freshworks', 'Senior Director - Legal', 'General'),
  mk('Pranay Bansal', 'pranay.bansal@jpmorgan.com', 'JPMC', 'VP UX', 'General'),
  mk('Praneet', 'teenarp@amazon.com', 'Amazon', 'SPM', 'General'),
  mk('Prasen Ghadyalpatil', 'prasen@nuvikatech.com', 'Nuvika Technologies', 'Intern', 'General'),
  mk('Prashant Srinivasan', 'prashant.s@codewalla.com', 'Codewalla', 'Managing Director', 'General'),
  mk('Pratik Mishra', 'pratik.mishra@toasttab.com', 'Toast', 'Software Engineer', 'General'),
  mk('Priyam Rajvanshi', 'priyam.rajvanshi@freshworks.com', 'Freshworks', 'Senior Software Engineer', 'General'),
  mk('Priyanka Ayyadurai', 'priyanka.ayyadurai@freshworks.com', 'Freshworks', 'senior software engineer', 'General'),
  mk('Priyanshi Yadav', 'priyanshi.yadav@toasttab.com', 'Toast', 'SDE2', 'General'),
  mk('Purnesh Dixit', 'purnesh.dixit92@gmail.com', 'Google', 'Senior Software Engineer', 'General'),
  mk('Rachna Bhalla', 'rachna.bhalla23@gmail.com', 'Igel', 'Product manager', 'General'),
  mk('Rachna Dixit', 'nikkiejazz@gmail.com', 'Axis Bank', 'Product Manager', 'General'),
  mk('Radhika Janarthanam', 'radhika_janarthanam@comcast.com', '', '', 'General'),
  mk('Raghava Prasad Sridar', 'raghava.prasad.sridar@toasttab.com', 'Toast', 'Senior Data Analyst', 'General'),
  mk('Rahul Dasari', 'dasarirahulpatel.drp@gmail.com', 'Rahul Talks', 'Tech Content Creator', 'General'),
  mk('Rahul Gupta', 'rahul.gupta@freshworks.com', 'Freshworks', 'Lead Software Engineer', 'General'),
  mk('Rahul Rathore', 'rahul.rathore@toasttab.com', 'Toast', 'Senior QA Automation Engineer', 'General'),
  mk('Raj Aryan', 'raj.aryan@revrag.ai', 'RevRag AI', 'Marketing Associate', 'General'),
  mk('Rajat Mohan', 'rajat.mohan@freshworks.com', 'Freshworks', 'CSM', 'General'),
  mk('Rajat S', 'rajats@sprinto.com', 'Sprinto', 'Senior product designer', 'General'),
  mk('Rajeev', 'rajeev@hiringeye.com', 'Hiring eye', 'Founder & CEO', 'General'),
  mk('Rajesh Potti', 'rajesh.potti@hrblock.com', 'H&R Block India Private Limited', 'Senior Product Manager', 'General'),
  mk('Rajkumar Kantaria', 'rajkumar.kantaria@freshworks.com', 'Freshworks', 'Lead Software Engineer', 'General'),
  mk('Rakhi Sharma', 'rakhi.ptr@gmail.com', 'House of Manthan', 'Creator and Founder', 'General'),
  mk('Rakshitha', 'rakshitha@herkey.com', '', '', 'General'),
  mk('Ranjan Pai', 'ranjanp@sprinto.com', 'Sprinto', 'Senior product designer', 'General'),
  mk('Ranjitha C', 'ranjithaac@gmail.com', 'Ford', 'Product Lead', 'General'),
  mk('Reet Wadhwani', 'reet.wadhwani@murf.ai', 'Murf AI', 'Brand Marketing Associate', 'General'),
  mk('Reetika Choudhary', 'reetika.choudhary@walmart.com', 'Walmart Global Tech', 'Senior manager Product Management', 'General'),
  mk('Reshma Hariharan', 'reshma@zensible.com', 'Zensible Technologies', 'Head - Agentic Products', 'General'),
  mk('Richa Bhandari', 'richab.c@anitab.org', 'Anitab.org India', 'Manager', 'General'),
  mk('Richa Kulkarni', 'richa.kulkarni@unilever.com', 'Unilever', 'Data AI Lead', 'General'),
  mk('Rishav Dutta', 'rishav.dutta@toasttab.com', 'Toast', 'Senior Data Scientist', 'General'),
  mk('Ritik Gupta', 'gupta.ritik@popclub.co', 'POP by Razorpay', 'Design Engineer', 'General'),
  mk('Romit Lakra', 'romit.lakra@sap.com', 'SAP Labs India', 'Senior Product Manager', 'General'),
  mk('Ryan Chowdhury', 'ryan24work@gmail.com', 'Career Break', 'Career Break', 'General'),
  mk('Saaniya Afreen', 'saaniya@vibtree.com', 'Oneinbox', 'Product Manager', 'General'),
  mk('Sagar Daliya', 'sagar.daliya@plivo.com', 'Plivo', 'Product Lead - Voice', 'General'),
  mk('Sahana Mukherjee', 'sahanamukherjee8@gmail.com', '', '', 'General'),
  mk('Sai Sudha Shenoy', 'saisudha.shenoy@gmail.com', '', '', 'General'),
  mk('Sai Sudha Shenoy', 'saisudha.shenoy@dell.com', 'Dell Technologies', 'Principal Product Manager', 'General'),
  mk('Saimahalakshmi Venkatraman', 'saimahalakshmi.venkatraman@freshworks.com', 'Freshworks', 'Lead Software Engineer - Test', 'General'),
  mk('Sajid Ali', 'syed.sajid.ali.2403@gmail.com', 'The Builders Club', 'Marketing lead', 'General'),
  mk('Sakshi Parashar', 'sakshi.parashar@testsigma.com', 'Testsigma', 'Revenue Operations Manager', 'General'),
  mk('Sakshi Tiwari', 'sakshi.tiwari@servicenow.com', '', '', 'General'),
  mk('Saloni Chandra', 'salonichandra.insead@gmail.com', 'Fyx Technologies Pte.', 'Lead - Product & GTM', 'General'),
  mk('Samyutha', 'r.samyutha@gmail.com', 'Gravity ilabs', 'BI/BA Analyst', 'General'),
  mk('Sangeetha Balakrishnan', 'sangeetha.balakrishnan.k@gmai.coml', 'Workday', 'Product Manager', 'General'),
  mk('Sanil Bhatte', 'sanil.bhatte@jpmorgan.com', 'JP Morgan Chase', 'VP Product Design Lead', 'General'),
  mk('Sanketh Y S', 'sanketh.ys@zohocorp.com', 'Zoho Corporation Pvt Ltd', 'Principal - Growth & Strategy', 'General'),
  mk('Sara Agarwal', 'saraagarwal23@gmail.com', 'Merit Labs', 'Software Developer', 'General'),
  mk('Saranya Prakash', 'saranya.prakash@flipkart.com', 'Flipkart', '', 'General'),
  mk('Sathish Srinivasan', 'sathish.srinivasan@clearroute.io', 'ClearRoute', 'Staff Engineer', 'General'),
  mk('Saurabh Mahajan', '1811050@noogler.google.com', 'Group Product manager', 'Google', 'General'),
  mk('Sayali Shaligram', 'sayalishaligram12@gmail.com', 'Independent Consultant', 'Domain Consultant', 'General'),
  mk('Shabbir Ahmed', 'shabbir.ahmed@smithsdetection.com', 'Smiths Detection', 'Tech Lead', 'General'),
  mk('Shaik Mahammad Shahid Afrid', '23091a32d4@rgmcet.edu.in', 'Rajeev Gandhi Memorial College of Engineering and Technology', 'Student - UiPath Student Developer Champion', 'General'),
  mk('Shaik Rehana', '23091a32c1@rgmcet.edu.in', 'Rajeev Gandhi Memorial College of Engineering and Technology', 'Student', 'General'),
  mk('Shakti Babbar', 'babbarshakti@outlook.com', 'S&P Global MI', 'Product Manager', 'General'),
  mk('Shalini Periyasamy', 'shalini.p@codewalla.com', 'Codewalla', 'SDE', 'General'),
  mk('Shalini Raina', 'shalini.raina@observe.ai', 'Observe.ai', 'Lead Product Manager', 'General'),
  mk('Shanmugapriya KS', 'shanmugapriya@hiringeye.com', 'Hiring eye', '', 'General'),
  mk('Shashank Sharma', 'sharma.shanx@gmail.com', 'Walmart', 'Staff Product Manager', 'General'),
  mk('Shilpa Podilla', 'p.shilpa@flipkart.com', '', '', 'General'),
  mk('Shiva Shankar', 'shiva.u@codewalla.com', 'Codewalla', 'SDE', 'General'),
  mk('Shivam Gupta', 'shivamg.iitr@gmail.com', 'Flexport', 'Senior Product Manager', 'General'),
  mk('Shobhit Suman', 'shobhit.suman@hungerbox.com', '', '', 'General'),
  mk('Shraddha Mehta', 'shraddhamehta7@gmail.com', 'Grab', 'Principal Product Manager', 'General'),
  mk('Shraddha Suresh', 'sshraddha@lululemon.com', 'Lululemon', '', 'General'),
  mk('Shravanthi Majji', 'shravanthi.majji@freshworks.com', 'Freshworks', 'Staff Product Manager', 'General'),
  mk('Shriya Rao', 'shriya.rao@testsigma.com', 'Testsigma', 'Presales Manager', 'General'),
  mk('Shubham Danannavar', 'shubhamd@sprinto.com', 'Sprinto', 'Product Manager', 'General'),
  mk('Shubhangi Jena', 'shubhangi.jena@gartner.com', 'Principal Analyst', 'Gartner', 'General'),
  mk('Shubhodaye Hiremath', 'shubhodaye@gmail.com', 'Freelancer', 'Software Tester', 'General'),
  mk('Shweta Chakraborty', 'shweta.chakraborty@salesforce.com', 'Salesforce', 'Director, Software Engineering', 'General'),
  mk('Sidhant Sawant', 'sidhant.s.sawant@gmail.com', 'Booking Holdings', 'Technical Product Manager', 'General'),
  mk('Sidharth Suresh', 'founders@fashnstack.com', 'Founder/CEO', 'Fashnstack', 'General'),
  mk('Siya Agarwal', 'siyaagarwal0225@gmail.com', 'Passport', 'Senior Product Manager', 'General'),
  mk('Siya Singh', 'siyasingh060120@gmail.com', 'Shell', 'Product Manager', 'General'),
  mk('SMK Murthy', 'murthy.sistla@jpmchase.com', 'JPMorganChase', 'Sr. Associate', 'General'),
  mk('Smriti Chawla', 'smritic.1607@gmail.com', 'PMM Lens', 'Product Marketing Consultant', 'General'),
  mk('Sneha K', 'sneha.k@codewalla.com', 'Codewalla', 'SDE-2', 'General'),
  mk('Sneha Sadasivan Pillai', 'sneha.sadasivanpillai@hrblock.com', 'H&R Block India Private Limited', 'Product Manager', 'General'),
  mk('Snehesh Mitra', 'snehesh@google.com', 'Google', '', 'General'),
  mk('Snigdhaa Sharma', 'snigdhaa.s@cogniquest.ai', 'Cogniquest AI', 'Product Manager', 'General'),
  mk('Sohail Khan', 'sohail@thebuildersclub.me', 'The Builders Club', 'Founder', 'General'),
  mk('Somil Jain', 'somil@vaaniresearch.com', 'Vaani AI Research', 'Founding Engineer', 'General'),
  mk('Sona Ganesan', 'sona.ganesan@freshworks.com', 'Freshworks', 'Lead Software Engineer - Test', 'General'),
  mk('Sonika Panghal', 'sonikap70@gmail.com', 'Godrej Capital', 'Product Manager MarTech', 'General'),
  mk('Soumya Choubey', 'soumya.c304@gmail.com', '', '', 'General'),
  mk('Soumyadeep Bohidar', 'sb001206210@techmahindra.com', 'Tech Mahindra', 'Senior Business Associate', 'General'),
  mk('Souvik Sarkar', 'souvikrishi@gmail.com', 'Mercedes Benz R&D', 'Senior Product Manager', 'General'),
  mk('Sowmya Ashok', 'sowmyashok2007@gmail.com', 'CertifyOS', 'Principal Program Manager', 'General'),
  mk('Sowmya Gattupalli', 'sowmya.gattupalli@gmail.com', 'Real Page Inc', 'Senior Product Manager', 'General'),
  mk('Sparsh Gupta', 'sparsh.gupta@toasttab.com', 'Toast', 'Data Scientist', 'General'),
  mk('Sree Pasumarthy', 'sreevally86@gmail.com', 'Leoforce', 'Senior Product Manager', 'General'),
  mk('Sreya Sanyal', 'sanyal.sreya0490@gmail.com', 'Ford Motor Company', 'Product Lead', 'General'),
  mk('Sriram Nithyanandam', 'sriram.nithyanandam@freshworks.com', 'Freshworks', 'Senior software engineer', 'General'),
  mk('Sriram Sridhar', 'sriram.sridhar@freshworks.com', 'Freshworks', 'Lead Software Engineer', 'General'),
  mk('Srishti Agrawal', 'aggrawal.srishti@gmail.com', '', '', 'General'),
  mk('Srivatsan Sundaravaradan', 'srivats1@netapp.com', 'NetApp', 'Staff Product Manager', 'General'),
  mk('Subalakshmi J', 'subalakshmi.j@clearroute.io', 'ClearRoute', 'Engineering', 'General'),
  mk('Suganthi Arumugam', 'suganthi.arumugam@lseg.com', 'LSEG', 'Head of Data Asset', 'General'),
  mk('Suganya Gopalan', 'suganya.gopalan@hrblock.com', 'H&R Block India Private Limited', 'Associate Manager', 'General'),
  mk('Suganya V', 'suganya.v@freshworks.com', 'Freshworks', 'Senior Software Engineer - Frontend', 'General'),
  mk('Suhas Srinivas', 'pavankrishna1994@gmail.com', 'Adobe', 'Enterprise Account Sales Manager', 'General'),
  mk('Sumit Dev', 'sumit.d@atollsolutions.com', 'Atoll Solutions', 'CPO', 'General'),
  mk('Sushma Bhargav', 'sbhargav@matchbookai.com', 'Matchbook AI', 'Global Product Leader', 'General'),
  mk('Suyash Ratna', 'su.shrey1167@gmail.com', '', '', 'General'),
  mk('Swapnil Agrawal', 'swapnilagrawal1@kpmg.com', 'KPMG Assurance and Consulting Services LLP', 'Associate Director', 'General'),
  mk('Swasthik Prabhu', 'swasthik.prabhu@flipkart.com', 'Flipkart', '', 'General'),
  mk('Swathi Chirravuri', 'swathi.chirravuri@gmail.com', 'Stealth Startup', 'AI Product Manager', 'General'),
  mk('Swati Subhalaxmi Samal', 'swatisubhalaxmisamal@gmail.com', 'Business Associate', 'KreditBee', 'General'),
  mk('Swetha Kulkarni', 'swetha.kulkarni@gmail.com', 'Oracle', 'Product Manager', 'General'),
  mk('Tammana Sriraj', 'tammanasriraj@gmail.com', 'Appian', 'Product Manager', 'General'),
  mk('Tanushree Naaz', 'tanushree.naaz@walmart.com', '', '', 'General'),
  mk('Tushar Anand', 'tusharanandinbox@gmail.com', '', '', 'General'),
  mk('Udit Gattani', 'uditgattani.ism@gmail.com', 'Mercari Inc.', '', 'General'),
  mk('Umang Agarwal', 'umang.agarwal@freshworks.com', 'Freshworks', 'Lead Software Engineer', 'General'),
  mk('Varnika Chaturvedi', 'varnika.chaturvedi@testsigma.com', 'Testsigma', 'Head Product', 'General'),
  mk('Varun Prasadd', 'varunprasadd23@gmail.com', 'Facilio', 'Product Manager', 'General'),
  mk('Versha Jain', 'versha@getpanelready.com', 'PanelReady', 'Founder', 'General'),
  mk('Viha Shomikha A S', 'viha@weareautumn.com', 'Autumn Tech Worx', 'Associate Project Manager', 'General'),
  mk('Vijay G', 'vijay.gnanasekaran@freshworks.com', 'Freshworks', 'Lead Frontend Engineer', 'General'),
  mk('Vijay JB', 'vijaybaskaren@gmail.com', 'Tesco', 'Product Manager', 'General'),
  mk('Vijayraj Honnur', 'vijayraj.honnur@ibm.com', 'IBM', 'Senior Product Designer', 'General'),
  mk('Vikram Bodavula', 'vikramb@microsoft.com', 'Microsoft India R&D Pvt Ltd', 'Principal Lead Product Manager', 'General'),
  mk('Vinay BV', 'vinay1.bv@ril.com', 'Jio Platform', 'Product Manager', 'General'),
  mk('Vineet Pujari', 'vineet.pujari@automationanywhere.com', 'Automation Anywhere', 'Principal Product Manager', 'General'),
  mk('Vishal Chaudhary', 'chvishal@athenahealth.com', 'Athenahealth', 'Product Manager', 'General'),
  mk('Vishwajeet Jonnada', 'jonnada.vishwajeet@gmail.com', 'CGI', 'Technical Product Owner', 'General'),
  mk('Vishwas Saini', 'vishwassaini32@gmail.com', 'Vegapay', '', 'General'),
  mk('Vivek Bharadwaj', 'vivek.bharadwaj@grabtaxi.com', 'Grab', 'Group Product Manager', 'General'),
  mk('Yasha V', 'yashaswini@autothinker.org', '', '', 'General'),
  mk('Yashaswini Ravi', 'yashaswini.ravi@testsigma.com', 'Testsigma', 'Head Marketing', 'General'),
  mk('Yerramchetty Rupesh', 'yerramchetty.rupesh@freshworks.com', 'Freshworks', 'Senior Forward Deployed Engineer', 'General'),
  mk('Yuti Swapnil Agrawal', 'yuti.nangliya@citiustech.com', 'CitiusTech', 'Technical Sr. Lead/Specialist', 'General'),
  mk('Zahira Shaik', 'zahira.s@arnifi.com', 'SEO Content Writer', 'Arnifi', 'General'),
  mk('Zairah Zaheer', 'zairah.zaheer@dataart.com', 'DataArt Technologies India Pvt Ltd', 'HR Manager', 'General'),
]

// ── Deduplicate by email key (first occurrence wins) ─────────────────────────
const seen = new Set<string>()
const ATTENDEES = RAW.filter(a => {
  const k = a.email.toLowerCase()
  if (seen.has(k)) return false
  seen.add(k)
  return true
})

// ── Persistence ───────────────────────────────────────────────────────────────
function loadCheckins(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function saveCheckins(d: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
}
async function syncServer(a: Attendee, action: 'checkin' | 'undo') {
  try {
    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: a.name, email: a.email, bucket: a.bucket, tier: a.tier,
        action, pass_number: genPass(a.email, a.tier),
        timestamp: new Date().toISOString(),
      }),
    })
  } catch { /* localStorage already saved; server sync is best-effort */ }
}

// ── Colours ───────────────────────────────────────────────────────────────────
const BC: Record<Bucket, { bg: string; text: string; border: string; label: string }> = {
  Speaker:   { bg: 'rgba(245,158,11,.15)',  text: '#FBBF24', border: 'rgba(245,158,11,.4)',  label: 'SPEAKER'   },
  Hackathon: { bg: 'rgba(59,130,246,.15)',  text: '#60A5FA', border: 'rgba(59,130,246,.4)',  label: 'HACKATHON' },
  VIP:       { bg: 'rgba(167,139,250,.15)', text: '#A78BFA', border: 'rgba(167,139,250,.4)', label: 'VIP'       },
  Premium:   { bg: 'rgba(251,146,60,.15)',  text: '#FB923C', border: 'rgba(251,146,60,.4)',  label: 'PREMIUM'   },
  General:   { bg: 'rgba(52,211,153,.1)',   text: '#34D399', border: 'rgba(52,211,153,.3)',  label: 'GENERAL'   },
}

const BUCKET_ORDER: Bucket[] = ['Speaker', 'Hackathon', 'VIP', 'Premium', 'General']

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  function submit() {
    if (pw === ACCESS_PASSWORD) { sessionStorage.setItem(SESSION_KEY, '1'); onAuth() }
    else { setErr(true); setPw(''); ref.current?.focus() }
  }
  return (
    <div style={{ minHeight: '100vh', background: '#05040C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360, background: '#0D0B1E', border: '1px solid #1C1A32', borderRadius: 20, padding: '40px 32px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 6px', fontFamily: 'monospace', fontSize: 10, color: '#7C3AED', letterSpacing: '.2em', textTransform: 'uppercase' }}>TGPF 2026 · Volunteers Only</p>
        <h2 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 800, color: '#F0EEF8' }}>Check-in Access</h2>
        <input ref={ref} type="password" value={pw}
          onChange={e => { setPw(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Enter password"
          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', marginBottom: 12, background: '#080618', border: `1px solid ${err ? '#F87171' : '#3B3860'}`, borderRadius: 10, color: '#F0EEF8', fontSize: 15, outline: 'none', textAlign: 'center', letterSpacing: '.1em' }}
        />
        {err && <p style={{ margin: '0 0 12px', fontSize: 12, color: '#F87171' }}>Incorrect password.</p>}
        <button onClick={submit} style={{ width: '100%', padding: 13, background: '#7C3AED', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '.08em' }}>ENTER</button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CheckinPage() {
  const [authed,      setAuthed]      = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [checkins,    setCheckins]    = useState<Record<string, boolean>>(loadCheckins)
  const [query,       setQuery]       = useState('')
  const [activeTab,   setActiveTab]   = useState<Bucket | 'All'>('All')
  const [lastChecked, setLastChecked] = useState<Attendee | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (authed) inputRef.current?.focus() }, [authed])

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  function doCheckin(a: Attendee) {
    const next = { ...checkins, [a.email.toLowerCase()]: true }
    setCheckins(next); saveCheckins(next); setLastChecked(a)
    syncServer(a, 'checkin')
    setQuery(''); inputRef.current?.focus()
  }
  function doUndo(a: Attendee) {
    const next = { ...checkins }; delete next[a.email.toLowerCase()]
    setCheckins(next); saveCheckins(next)
    syncServer(a, 'undo')
  }

  function exportCSV() {
    const rows = ['Name,Email,Company,Role,Bucket,Tier,PassNumber,CheckedIn']
    ATTENDEES.forEach(a => {
      const pn = genPass(a.email, a.tier)
      const ci = checkins[a.email.toLowerCase()] ? 'YES' : 'NO'
      rows.push(`"${a.name}","${a.email}","${a.company}","${a.role}",${a.bucket},${a.tier},${pn},${ci}`)
    })
    const csv = rows.join('\n')

    // Download locally
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const el = document.createElement('a'); el.href = url; el.download = 'tgpf2026-checkins.csv'; el.click()

    // Also email a copy as backup
    const checkedInCount = ATTENDEES.filter(a => checkins[a.email.toLowerCase()]).length
    fetch('/api/export-checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        csv,
        totalCheckedIn: checkedInCount,
        totalAttendees: ATTENDEES.length,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => { /* best-effort */ })
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    let list = activeTab === 'All' ? ATTENDEES : ATTENDEES.filter(a => a.bucket === activeTab)
    if (!q) return list
    return list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      genPass(a.email, a.tier).toLowerCase().includes(q)
    )
  }, [query, activeTab])

  const totalIn  = Object.values(checkins).filter(Boolean).length
  const total    = ATTENDEES.length
  const bCounts  = useMemo(() => {
    const c: Record<string, { in: number; total: number }> = {}
    BUCKET_ORDER.forEach(b => { c[b] = { in: 0, total: 0 } })
    ATTENDEES.forEach(a => {
      c[a.bucket].total++
      if (checkins[a.email.toLowerCase()]) c[a.bucket].in++
    })
    return c
  }, [checkins])

  return (
    <div style={{ minHeight: '100vh', background: '#05040C', padding: '20px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 3px', fontFamily: 'monospace', fontSize: 10, color: '#7C3AED', letterSpacing: '.2em', textTransform: 'uppercase' }}>Admin · Check-in · TGPF 2026</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#F0EEF8' }}>Entry · RMZ Ecoworld</h1>
            <button onClick={exportCSV} style={{ background: '#0D0B1E', border: '1px solid #1C1A32', borderRadius: 10, padding: '8px 16px', color: '#52506A', fontSize: 12, cursor: 'pointer' }}>Export CSV</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ background: '#0D0B1E', border: '1px solid #1C1A32', borderRadius: 12, padding: '10px 18px', flex: '1 1 120px' }}>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#34D399' }}>{totalIn}<span style={{ fontSize: 14, color: '#52506A' }}>/{total}</span></p>
            <p style={{ margin: 0, fontSize: 11, color: '#52506A' }}>Total Checked In</p>
          </div>
          {BUCKET_ORDER.map(b => (
            <div key={b} style={{ background: '#0D0B1E', border: `1px solid ${BC[b].border}`, borderRadius: 12, padding: '10px 16px', flex: '1 1 100px' }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: BC[b].text }}>{bCounts[b].in}<span style={{ fontSize: 12, color: '#52506A' }}>/{bCounts[b].total}</span></p>
              <p style={{ margin: 0, fontSize: 10, color: BC[b].text, fontFamily: 'monospace', letterSpacing: '.1em' }}>{b.toUpperCase()}</p>
            </div>
          ))}
        </div>

        {/* Last checked-in */}
        {lastChecked && (
          <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 12, padding: '12px 18px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, color: '#34D399', fontFamily: 'monospace', letterSpacing: '.1em' }}>JUST CHECKED IN</p>
              <p style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 700, color: '#F0EEF8' }}>{lastChecked.name}</p>
              <p style={{ margin: '1px 0 0', fontSize: 12, color: '#6B7280' }}>{lastChecked.company} · <span style={{ color: BC[lastChecked.bucket].text }}>{lastChecked.bucket} lanyard</span></p>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#34D399' }}>✓</div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {(['All', ...BUCKET_ORDER] as const).map(tab => {
            const active = activeTab === tab
            const count  = tab === 'All' ? total : bCounts[tab].total
            const inCount = tab === 'All' ? totalIn : bCounts[tab].in
            const color  = tab === 'All' ? '#F0EEF8' : BC[tab].text
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: `1px solid ${active ? (tab === 'All' ? '#3B3860' : BC[tab].border) : '#1C1A32'}`,
                  background: active ? (tab === 'All' ? '#1C1A32' : BC[tab].bg) : 'transparent',
                  color: active ? color : '#52506A', cursor: 'pointer', fontFamily: 'monospace',
                  fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                {tab} <span style={{ opacity: .7 }}>{inCount}/{count}</span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input ref={inputRef} value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filtered.length === 1 && !checkins[filtered[0].email.toLowerCase()])
                doCheckin(filtered[0])
            }}
            placeholder="Search name · email · company · or scan QR code…"
            autoComplete="off" autoCorrect="off" spellCheck={false}
            style={{ width: '100%', boxSizing: 'border-box', padding: '13px 40px 13px 16px', background: '#0D0B1E', border: '1px solid #3B3860', borderRadius: 12, color: '#F0EEF8', fontSize: 15, outline: 'none' }}
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus() }}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#52506A', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* List */}
        <div style={{ border: '1px solid #1C1A32', borderRadius: 16, overflow: 'hidden' }}>
          {filtered.length === 0
            ? <div style={{ padding: '32px 20px', textAlign: 'center', color: '#52506A' }}>No match for "{query}"</div>
            : filtered.map((a, i) => {
              const isIn  = checkins[a.email.toLowerCase()]
              const pn    = genPass(a.email, a.tier)
              const bc    = BC[a.bucket]
              return (
                <div key={a.email + i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                  background: isIn ? 'rgba(16,185,129,.04)' : (i % 2 === 0 ? '#080618' : '#05040C'),
                  borderBottom: i < filtered.length - 1 ? '1px solid #1C1A32' : 'none',
                  opacity: isIn ? 0.65 : 1,
                }}>
                  <span style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: 8, letterSpacing: '.1em', padding: '3px 7px', borderRadius: 20, background: bc.bg, color: bc.text, border: `1px solid ${bc.border}`, textTransform: 'uppercase' }}>
                    {bc.label}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: isIn ? '#52506A' : '#F0EEF8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isIn && <span style={{ color: '#34D399', marginRight: 6 }}>✓</span>}{a.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: '#52506A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {[a.company, a.role].filter(Boolean).join(' · ')}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: '#2D2B4A' }}>{pn}</p>
                  </div>
                  {isIn
                    ? <button onClick={() => doUndo(a)} style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#F87171', cursor: 'pointer' }}>Undo</button>
                    : <button onClick={() => doCheckin(a)} style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 8, background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.35)', color: '#34D399', cursor: 'pointer', fontWeight: 700 }}>Check In</button>
                  }
                </div>
              )
            })
          }
        </div>

        <p style={{ margin: '14px 0 0', fontSize: 10, color: '#2D2B4A', textAlign: 'center' }}>
          {filtered.length} shown · {total} total · saved locally + synced to server · <a href="/" style={{ color: '#7C3AED' }}>← home</a>
        </p>
      </div>
    </div>
  )
}