import { z } from 'zod';


export const authValidationSchema = z.object({
  username: z
    .string({ required_error: 'Le nom d\'utilisateur est requis.' })
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères.'),
  password: z
    .string({ required_error: 'Le mot de passe est requis.' })
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
});


export const employeeValidationSchema = z.object({
  firstName: z
    .string({ required_error: 'Le prénom est requis.' })
    .min(2, 'Le prénom doit contenir au moins 2 caractères.'),
  lastName: z
    .string({ required_error: 'Le nom est requis.' })
    .min(2, 'Le nom doit contenir au moins 2 caractères.'),
});


export type AuthFormData = z.infer<typeof authValidationSchema>;
export type EmployeeFormData = z.infer<typeof employeeValidationSchema>;