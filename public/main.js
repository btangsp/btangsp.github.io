// JavaScript Document

// function for back button

function goBack() {
    window.history.back()
}

// changes "Hi, I am" statement on landing page
var titles = ["A Scientist", "An Artist", "A Chemist", "A Designer", "A Computer Scientist", "A Life-long Learner", "Brian L. Tang"];
var idx = 0;
var element = $("#main-title");

setInterval(changeTitle, 3000);

function changeTitle() {
    element.fadeOut(function(){
        element.html(titles[idx]);
        idx++;
        if (idx >= titles.length) {
            idx = 0;
        }
        element.fadeIn();
    });
}

// animates scroll down anchor 
// (source: https://www.solodev.com/blog/web-design/adding-a-scroll-down-anchor-to-your-website.stml)
$(document).ready(function(){
    $('a').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 30
            }, 800, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// about me information
var schools = [
    {
        time: "September 2020 — December 2021",
        name: "Northwestern University",
        location: "Evanston, IL",
        degree: "Master of Science in Computer Science"
    },
    {
        time: "",
        name: "",
        location: "",
        degree: ""
    },
    {
        time: "September 2014 — April 2018",
        name: "University of Michigan",
        location: "Ann Arbor, MI",
        degree: "Bachelor of Science in Chemistry<br>Minor in Computer Science"
    },
    {
        time: "September 2010 — May 2014",
        name: "Brighton High School",
        location: "Brighton, MI",
        degree: "High School Diploma"
    }
];

function educationInfo(schools, sectionSelector) {
    let section = document.querySelector(sectionSelector);
    if (section) {
        if (schools instanceof Array) {
            for (let school of schools) {
                let html = 
                    `<p>${school.time}</p>
                    <p class="item-title">${school.name}</p>
                    <p class="location">${school.location}</p>
                    <p>${school.degree}</p>`
                let container = document.createElement("div");
                container.className="bio-item";
                container.innerHTML = html;
                container.tabIndex = schools.indexOf(school);
                section.append(container);
            }
        }
    }
}

var courses = [
    {
        year: "2021",
        name: "Scalable Software Architecture<br>Deep Learning Foundations from Scratch<br>Machine Perception of Music & Audio<br>Human-Computer Interaction Studio<br>Digital Musical Instrument Design<br>Rapid Software Prototyping<br>Interactive Information Visualization"
    },
    {
        year: "2020",
        name: "Human-Computer Interaction<br>Machine Learning<br>Computational Photography<br>Cybersecurity"
    },
    {
        year: "2018",
        name: "Artificial Intelligence"
    },
    {
        year: "2017",
        name: "Introduction to Data Structures & Algorithms"
    },
    {
        year: "2016",
        name: "Discrete Mathematics"
    }
];

function courseInfo(courses, sectionSelector) {
    let section = document.querySelector(sectionSelector);
    if (section) {
        if (courses instanceof Array) {
            for (let course of courses) {
                let html = `<p class="semibold">${course.year}</p><p>${course.name}</p>`
                let container = document.createElement("div");
                container.className="bio-item grid";
                container.innerHTML = html;
                container.tabIndex = courses.indexOf(course);
                section.append(container);
            }
        }
    }
}

var organizations = [
    {
        time: "August 2015 — April 2017",
        name: "A2 Code Blue Jump Rope Club",
        position: "Founder, President (August 2015 — April 2017)"
    },
    {
        time: "January 2017 — April 2018",
        name: "Alpha Chi Sigma (Professional Chemistry Fraternity)",
        position: "Webmaster (January 2017 — April 2018)<br>Head Social Media Chair (January 2017 — April 2018)"
    },
    {
        time: "August 2014 — January 2018",
        name: "Michigan Marching Band",
        position: "Rank Leader (August 2017 — January 2018)<br>Mellophone (August 2014 — January 2018)"
    },
    {
        time: "January 2015 — April 2018",
        name: "Michigan Pops Orchestra",
        position: "French Horn (January 2015 — April 2018)"
    }
];

function organizationInfo(organizations, sectionSelector) {
    let section = document.querySelector(sectionSelector);
    if (section) {
        if (organizations instanceof Array) {
            for (let organization of organizations) {
                let html = `<p>${organization.time}</p>
                    <p class="item-title">${organization.name}</p>
                    <p>${organization.position}</p>`
                let container = document.createElement("div");
                container.className="bio-item";
                container.innerHTML = html;
                container.tabIndex = organizations.indexOf(organization);
                section.append(container);
            }
        }
    }
}

var jobs = [
    {
        time: "Sept 2021 — Current",
        name: "Teaching Assistant (Human-Computer Interaction Studio)",
        location: "Northwestern University (Evanston, IL)",
        description: "I hold discussion sections where I help students with their project, which entails need-finding, designing, and refining their problem statements."
    },
    {
        time: "June 2021 — Sept 2021",
        name: "Teaching Assistant (Machine Learning)",
        location: "Northwestern University (Evanston, IL)",
        description: "I help answer students' questions regarding machine learning and related homework. In addition, I also help grade the assignments."
    },
    {
        time: "May 2020 — June 2020",
        name: "Analytical Chemist II",
        location: "Avomeen (Ann Arbor, MI)",
        description: "In this role, I demonstrated leadership within my group and I was officially designated as the peer mentor of several new hires of the comapny. I also held more responsibilities than my previous role as Analytical Chemist I. I worked more independently in the lab—without needing constant guidance from my project leader."
    },
    {
        time: "June 2019 — May 2020",
        name: "Analytical Chemist I",
        location: "Avomeen (Ann Arbor, MI)",
        description: "I did research and development with cGMP documentation on extractables and leachables testing of pharmaceutical products as well as impurities testing of nicotine products using GC-MS, GC-FID, HPLC, ICP-MS, and LC-MS."
    },
    {
        time: "January 2019 — June 2019",
        name: "Sample Coordinator",
        location: "Avomeen (Ann Arbor, MI)",
        description: "I handled sample, chemical, and lab equipment receiving and disposal—including cGMP manufacturing raw materials and controlled substances. I often served as the bridge between the different branches of the company—such as chemists, project managers, intake team, and quality assurance. I also performed quality assurance duties such as lab audits and revision of SOPs."
    },
    {
        time: "May 2017 — August 2017",
        name: "Summer Hire - through Computech",
        location: "BASF (Southfield, MI)",
        description: "I worked in high throughput environment on UV-curable resins. My duties included handling confidential information (IP), reading research papers, making formulations (add additives to resins), collecting data using photo differential scanning calorimetry, and analyzing data to determine curing time from enthalpy change."
    },
    {
        time: "May 2015 — August 2015",
        name: "Research Assistant of the Prostate Cancer Genetics Project",
        location: "University of Michigan Comprehensive Cancer Center (Ann Arbor, MI)",
        description: "I worked in a medical facility on genetic causes of prostate cancer. My role was to recruit patients for the study, administer surveys to patients, handle confidential patient information, contact hospitals for medical records, and create pedigree charts to discern patterns among patients with prostate cancer."
    }
];

function jobInfo(jobs, sectionSelector) {
    let section = document.querySelector(sectionSelector);
    if (section) {
        if (jobs instanceof Array) {
            for (let job of jobs) {
                let html = 
                    `<p>${job.time}</p>
                    <p class="item-title">${job.name}</p>
                    <p class="location">${job.location}</p>
                    <p>${job.description}</p>`
                let container = document.createElement("div");
                container.className="bio-item";
                container.innerHTML = html;
                container.tabIndex = jobs.indexOf(job);
                section.append(container);
            }
        }
    }
}

var awards = [
    {
        time: "November 2019",
        name: "Quality Star",
        location: "Avomeen (Ann Arbor, MI)",
        description: "Nominated and selected for having great compliance and lab work documentation."
    },
    {
        time: "February 2020",
        name: "On Time All The Time",
        location: "Avomeen (Ann Arbor, MI)",
        description: "Group award for having the best on time delivery in the company."
    }
];

function awardInfo(awards, sectionSelector) {
    let section = document.querySelector(sectionSelector);
    if (section) {
        if (awards instanceof Array) {
            for (let award of awards) {
                let html = `<p>${award.time}</p>
                    <p class="item-title">${award.name}</p>
                    <p>${award.location}</p>
                    <p>${award.description}</p>`
                let container = document.createElement("div");
                container.className="bio-item";
                container.innerHTML = html;
                container.tabIndex = awards.indexOf(award);
                section.append(container);
            }
        }
    }
}