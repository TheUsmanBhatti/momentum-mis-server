// =======================================  Importing Libraries  ================================================
const { Answer } = require('../models/answer');
const { Assessment } = require('../models/assessment');
const { User } = require('../models/user');

// --------------------------- Get All

const getAssessmentAnswer = async (req, res) => {
    try {
        const { assessmentId, userId } = req.params;

        // Check if the assessment exists
        const assessment = await Assessment.findById(assessmentId).populate('createdBy', 'firstName lastName').populate('questionnaires');
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }

        // Check if the user is part of the assessment
        const userInAssessment = assessment.users.find((user) => user.user.toString() === userId);
        if (!userInAssessment) {
            return res.status(404).json({ success: false, message: 'User not part of this assessment' });
        }

        // Find answers for the given user and assessment
        const answers = await Answer.find({ assessment: assessmentId, user: userId })
            .populate('questionnaire', 'title description')
            .populate('question', 'text type options')
            .select('answer questionnaire question');

        // Format the response
        const formattedResponse = {
            success: true,
            filledBy: userInAssessment.user?.firstName, // Assuming you want the user status here
            submittedAt: new Date(), // You can replace this with the actual submission date if available
            status: userInAssessment.status,
            assessment: {
                id: assessment.id,
                title: assessment.title,
                description: assessment.description,
                createdBy: assessment.createdBy ? `${assessment.createdBy.firstName} ${assessment.createdBy.lastName}` : null,
                createdOn: assessment.createdOn,
                dueDate: assessment.dueDate,
                questionnaires: assessment.questionnaires.map((questionnaire) => ({
                    id: questionnaire._id,
                    title: questionnaire.title,
                    description: questionnaire.description,
                    questions: answers
                        .filter(answer => answer.questionnaire._id.toString() === questionnaire._id.toString())
                        .map(answer => ({
                            questionId: answer.question._id,
                            question: answer.question.text,
                            type: answer.question.type,
                            options: answer.question.options,
                            answerId: answer._id,
                            answer: answer.answer
                        }))
                }))
            }
        };

        return res.status(200).json(formattedResponse);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message || err });
    }
};

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
        const { userId, assessmentId, answers } = req.body;;
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
    createAnswer,
    getAssessmentAnswer
    // updateData,
    // deleteData
};
