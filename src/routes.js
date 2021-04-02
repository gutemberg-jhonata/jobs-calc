const express = require("express");
const routes = express.Router();

const ProfileController = require("./controllers/ProfileController");
const Profile = require("./models/Profile");

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            dailyHours: 2,
            totalHours: 40,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            id: 2,
            name: "OneTwo Project",
            dailyHours: 3,
            totalHours: 3,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
    ],

    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map(job => {
                const remaining = Job.services.remainingDays(job);
                const status = remaining > 0 ? 'progress' : 'done';
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.get().valueHour),
                };
            });
        
            return res.render("index", { jobs: updatedJobs });
        },

        create(req, res) {
            return res.render("job")
        },

        save(req, res) {
            const lastId = Job.data[Job.data.length - 1]?.id || 0;
        
            Job.data.push({
                id: lastId + 1,
                ...req.body,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        
            return res.redirect('/');    
        },

        show(req, res) {
            const { id } = req.params;
            const job = Job.data.find(job => Number(job.id) === Number(id));

            if (!job) {
                return res.send('Job not found!');
            }

            job.budget = Job.services.calculateBudget(job, Profile.get().valueHour);

            return res.render("job-edit", { job });
        },

        update(req, res) {
            const { id } = req.params;
            const job = Job.data.find(job => Number(job.id) === Number(id));

            if (!job) {
                return res.send('Job not found!');
            }

            const updatedJob = {
                ...job,
                ...req.body
            }

            Job.data = Job.data.map(job => {
                if (Number(job.id) === Number(id)) {
                    job = updatedJob;
                }

                return job;
            });

            return res.redirect('/job/' + job.id);
        },

        delete(req, res) {
            const { id } = req.params;

            Job.data = Job.data.filter(job => Number(job.id) !== Number(id))

            return res.redirect('/');
        }
    },

    services: {
        remainingDays(job) {
            const remainingDays = (job.totalHours / job.dailyHours).toFixed();
                
            const createdDate = new Date(job.createdAt);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay);
            
            const timeDiffInMs = dueDateInMs - Date.now();
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);
        
            return dayDiff;
        },

        calculateBudget(job, valueHour) {
            return valueHour * job.totalHours;
        }
    }
}

routes.get('/', Job.controllers.index);

routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);

routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

module.exports = routes;