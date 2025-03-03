import mongoose from "mongoose";

const raceSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    sport: {type: String, enum: ["running", "trailRunning", "cycling"], required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true, trim: true},
    distance: {type: Number, required: true},
    maxParticipants: {type: Number, required: true},
    unevenness: {type: Number,required: true},
    tour: {type: String, required: true},
    qualifyingTime: {type: String, required: true},
    classification: [{
        runner: {
            type: String,
            required: true
        },
        mark: {
            type: Number,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'closed', 'finished', 'deleted'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Race', raceSchema);