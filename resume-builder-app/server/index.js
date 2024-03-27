//IMPORTS
const express = require("express");
const cors = require("cors");
const multer = require("multer"); //for file upload
const path = require("path"); //for file upload
require('dotenv').config(); //for API key env var

//MIDDLEWARE
const PORT = 4000;
const app = express();
//middleware is something that runs between the time that the server gets the request and the server sends a response.
app.use(cors()); // allow cross-origin requests from frontend to backend server
app.use(express.json()); //parse incoming request bodies in JSON format, such as POST to access request.body property.
app.use(express.urlencoded({ extended: true })); //parse incoming request bodies with URL-encoded data. req.body







// FILE STORAGE
app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});





// AI FUNCTION
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001" });
const GeminiFunction = async (prompt) => {
    // For text-only input, use the gemini-pro model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // console.log("prompt: ", prompt)
    // console.log("reponse: ", text);
    return text;
}


//Server routes to look nice.. (optional but good)
app.get('/', (req, res) => { res.send("Navigate to URL/resume/create."); })
app.get('/resume/create', (req, res) => { res.send("This is the resume creation server."); })



//FINALLY. FETCH FORM, PREDICT, AND REDIRECT
app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
    const {
        fullName,
        currentPosition,
        currentLength,
        currentTech,
        workHistory,
    } = req.body;

    console.log(req.body);

    const workArray = JSON.parse(workHistory); //an array




    const getWorkHistory = () => {
        let stringText = "";
        for (let i = 0; i < workArray.length; i++) {
            stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
        }
        return stringText;
    };

    // The job description prompt
    const prompt1 = `
    I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). 
    \n I write in the technologies: ${currentTech}. 
    Can you write a 100 words description for the top of the resume (first person writing)?
    `;

    // The job responsibilities prompt
    const prompt2 = `I am writing a resume, my details are \n name: ${fullName} 
    \n role: ${currentPosition} (${currentLength} years). 
    \n I write in the technologies: ${currentTech}. 
    Can you write 10 points for a resume on what I am good at? 
    `;

    // The job achievements prompt
    const prompt3 = `
    I am writing a resume, my details are \n name: ${fullName} 
    \n role: ${currentPosition} (${currentLength} years). 
    \n During my years I worked at ${workArray.length} companies. ${getWorkHistory()} 
    \n Can you write me 50 words for each company seperated in numbers of my succession in the company (in first person)? 
    `;

    // generate a Gemini result
    let objective, keypoints, jobResponsibilities; // Define variables outside the try-catch block

    try {

        // Gemini has this problem of using ** for bold text in your answer.
        const boldFormatting = /[**]/g;
        objective = await GeminiFunction(prompt1);
        objective = objective.replace(boldFormatting, '');
        keypoints = await GeminiFunction(prompt2);
        keypoints = keypoints.replace(boldFormatting, '');
        jobResponsibilities = await GeminiFunction(prompt3);
        jobResponsibilities = jobResponsibilities.replace(boldFormatting, '');


    }
    catch (error) {
        console.log("there is some kind of error :( Most likely, OpenAI is being annoying.", error);

        // Set default values in case of an error
        const defaultObjective = `
        I am a skilled professional with ${currentLength} years of experience in ${currentPosition}. 
        Proficient in ${currentTech}, I excel at delivering professional-grade projects to diverse clientele. My expertise lies in IT and technologies. 
        Seeking opportunities to leverage my skills and contribute to the industry.`;
        const defaultKeypoints = `
1. Design and implement: Collaborate with cross-functional teams to design, develop, and implement innovative technical solutions that enhance system functionality and user experience.
2. Technical troubleshooting: Leverage strong analytical and problem-solving skills to diagnose and resolve complex technical issues in a timely and efficient manner.
3. System administration: Perform system administration tasks including user provisioning, access control, system configuration, and performance optimization.
4. Automation and scripting:  Utilize scripting languages and automation tools to automate repetitive tasks, improve efficiency, and reduce the risk of human error.
5. Data analysis and reporting: Extract, analyze, and interpret technical data to generate insightful reports that inform decision-making and identify areas for improvement.
6. Infrastructure management: Contribute to the maintenance and support of IT infrastructure, ensuring optimal system uptime and performance.
7. Security awareness: Maintain a strong understanding of cybersecurity best practices and implement appropriate security measures to protect sensitive data and systems.
8. Version control and collaboration: Effectively utilize version control systems (e.g., Git) to manage code changes, collaborate with teammates, and maintain a clear development history.
9. Staying current:  Demonstrate a commitment to continuous learning by actively staying updated on emerging technologies and industry trends. 
10.Communication and documentation:  Clearly communicate technical concepts and solutions to both technical and non-technical audiences, while maintaining accurate and up-to-date documentation.
        `;
        const defaultJobResponsibilities = `
1. Increased server uptime by 15% through proactive infrastructure monitoring and preventative maintenance, resulting in a 20% reduction in help desk tickets.
2. Led the development of a new Python-based automation script that streamlined data migration processes, saving an estimated 40 hours of manual labor per month.
3. Successfully implemented a cloud-based disaster recovery solution, ensuring business continuity and minimizing downtime in the event of a system outage.
4. Championed the adoption of Agile development methodologies, leading to a 30% decrease in project delivery timelines and improved team collaboration.
5. Identified and resolved a critical security vulnerability in the company's e-commerce platform, mitigating potential financial losses and protecting customer data.
        `;

        // Use the default values or handle the error as required
        objective = defaultObjective;
        keypoints = defaultKeypoints;
        jobResponsibilities = defaultJobResponsibilities;
    }



    // put them into an object
    const generateID = () => Math.random().toString(36).substring(2, 10);
    const resumeInput = {
        id: generateID(),
        fullName,
        image_url: `http://localhost:4000/uploads/${req.file.filename}`,
        currentPosition,
        currentLength,
        currentTech,
        workHistory: workArray,
    };
    const generatedOutput = { objective, keypoints, jobResponsibilities };
    //log the result
    // console.log(chatgptData);


    //save
    const data = { ...resumeInput, ...generatedOutput };
    // database.push(data);

    //send object to frontend
    res.json({
        message: "Request successful!",
        data,
    });



});



app.listen(PORT);