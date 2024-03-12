import { MSG } from '../common/responseMessages';
import { Admin } from '../models/admin';
import { Privilege } from '../models/privilege';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export const createAdmin = async () => {
  try {
    dotenv.config();
    const email = process.env.ADMIN_EMAIL; //admin email
    // Check if a admin already exists
    const existingAdmin = await Admin.findOne({
      where: {
        email: email,
      },
      include: {
        model: Privilege,
        as: 'Privilege',
        where: {
          privilegeName: 'admin',
        },
      },
    });
    if (!existingAdmin) {
      // Find or create the "admin" privilege in the privileges table
      const [privilege] = await Privilege.findOrCreate({
        where: { privilegeName: 'admin' },
      });
      if (privilege) {
        // admin
        const password = process.env.ADMIN_PASSWORD ;
        const firstName = process.env.ADMIN_FIRSTNAME || 'admin';
        const lastName = process.env.ADMIN_LASTNAME || 'admin';
        // Encrypt user password
        const salt = bcrypt.genSaltSync(10);

        const bycrypted = bcrypt.hashSync(password as string, salt);

        // Create a new admin account with the associated privilege
        const newAdmin = await Admin.create({
          firstName: firstName, // field not null
          lastName: lastName, // field not null
          email: email,
          password: bycrypted,
          privilegeId: privilege.id,
        });
        if (newAdmin) {
          console.log({ message: MSG.CREATED_SUCCUSFULLY });
        }
      }
    }

    return;
  } catch (error) {
    // console.error(error);
    // return console.log({message: MSG.SERVER_ERROR});
  }
};
