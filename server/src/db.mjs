import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

mongoose.connect(process.env.DSN);

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'CourseList'}],
  credits: {type: Number, required: true, min: [0, "There are no credits left"], max: [20, "Maximum credits allowed (overloading)"], default: 16}
});

const CourseListSchema = new mongoose.Schema({
  schoolID: {type: Number, required: true, max: [12, "There are 12 schools in NYU"], min: [1, "There are 12 schools in NYU"]},
  majorID: {type: String, required: [true, "Major ID is required"]},
  courseID: {type: Number, required: [true, "Course ID is required"]},
  sectionID: {type: Number, required: [true, "Section ID is required"]},
  name: {type: String, required: [true, "Class's name is required"]},
  credits:{type: Number, min: 0, max: 4, required: [true, "Class's credit-entering is required"]},
  instructor: {type: String, required: [true, "Class's instructor name is required"]},
  description: {type: String, required: [true, "Class's description is required"]},
  instruction_mode: {type: String, required: true, enum:['in-person','virtual']},
  // time:[{
  //   time_date:[{type: String, required: true, enum:['monday', 
  //     'tuesday',
  //     'wednesday',
  //     'thursday',
  //     'friday',
  //     'saturday',
  //     'sunday'
  //   ],
  //   time_start:{type:Number, required: true, min: [0, "24 hours format"], max: [24, "24 hours format"]},
  //   time_end:{type:Number, required: true, min: [0, "24 hours format"], max: [24, "24 hours format"]}, //adding requirement time_end > time_start later
  // }]
  // }]
})

UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=username%>'});
CourseListSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=schoolID%>-<%=majorID%>-<%=courseID%>-<%=sectionID%>'});

mongoose.model('User', UserSchema);
mongoose.model('CourseList', CourseListSchema);

export default mongoose.models.UserSchema; mongoose.models.CourseListSchema