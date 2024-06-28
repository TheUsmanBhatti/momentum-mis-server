// =======================================  Importing Libraries  ================================================
const { Answer } = require('../models/answer');
const { Assessment } = require('../models/assessment');
const { User } = require('../models/user');

// --------------------------- Get All

// const getAll = async (req, res) => {
//     try {
//         const result = await Assessment.find({ isDeleted: false });

//         if (!result || result?.length == 0) {
//             return res.status(404).json({ success: false, message: 'Record not Found' });
//         }

//         res.status(200).send(result);
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
//     }
// };

// --------------------------- Get All by Id

// const getById = async (req, res) => {
//     try {
//         const result = await Assessment.findOne({ _id: req?.params?.id, isDeleted: false })
//             .populate({
//                 path: 'questionnaires',
//                 select: 'title description questions',
//                 populate: {
//                     path: 'questions',
//                     select: 'text type options',
//                 }
//             })
//             .populate('users.user', 'firstName lastName email designation')

//         if (!result) {
//             return res.status(404).json({ success: false, message: 'Assessment Not Found' });
//         }

//         res.status(200).send(result);
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
//     }
// };

// --------------------------- Create Assessment

const createAnswer = async (req, res) => {
    try {
        const { userId, assessmentId, answers } = req.body;

        // Check if the assessment exists
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Upsert answers (insert if not exists, update if exists)
        const upsertPromises = answers.map((answer) => {
            return Answer.findOneAndUpdate(
                { user: userId, assessment: assessmentId, questionnaire: answer.questionnaireId, question: answer.questionId },
                {
                    user: userId,
                    assessment: assessmentId,
                    questionnaire: answer.questionnaireId,
                    question: answer.questionId,
                    answer: answer.answer
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        });

        await Promise.all(upsertPromises);

        // Update user status in the assessment
        const userIndex = assessment.users.findIndex((u) => u.user.toString() === userId);
        if (userIndex > -1) {
            assessment.users[userIndex].status = 'completed';
            await assessment.save();
        }

        return res.status(201).json({ success: true, message: 'Assessment submitted successfully!' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// ----------------------  Update

// const updateData = async (req, res) => {
//     try {
//         const { id, partner, project, title, description, dueDate, questionnaires, users } = req?.body;
//         const check = await Assessment.findById(id);
//         if (!check) return res.status(400).send('Invalid Id!');

//         const result = await Assessment.findByIdAndUpdate(
//             id,
//             {
//                 partner,
//                 project,
//                 title,
//                 description,
//                 dueDate,
//                 questionnaires,
//                 users,
//                 updatedBy: req?.auth?.userId,
//                 updatedOn: new Date()
//             },
//             { new: true }
//         );

//         res.status(200).send({ success: true, updated: result });
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
//     }
// };

// ----------------------- Delete

// const deleteData = async (req, res) => {
//     try {
//         const check = await Assessment.findById(req?.params?.id);
//         if (!check) return res.status(400).send('Invalid Id!');

//         const result = await Assessment.findByIdAndUpdate(
//             req?.params?.id,
//             {
//                 isDeleted: true,
//                 deletedBy: req?.auth?.userId,
//                 deletedOn: new Date()
//             },
//             { new: true }
//         );

//         if (result) {
//             res.status(200).json({ success: true, message: 'Deleted' });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
//     }
// };

module.exports = {
    // getAll,
    // getById,
    createAnswer
    // updateData,
    // deleteData
};
