import { compare } from "bcryptjs";

export async function checkIfNewPasswordMatches(
  user,
  newPassword: string | undefined,
  oldPassword: string | undefined
) {
  if (!user) throw new Error("Usuário não encontrado");

  if (newPassword && !oldPassword) {
    throw new Error("É necessário informar a senha antiga para alterar a nova");
  }

  if (!newPassword && oldPassword) {
    throw new Error(
      "A nova senha não foi informada, apenas a antiga. Verifique os campos preenchidos."
    );
  }

  if (newPassword && oldPassword) {
    const isOldPasswordValid = await compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new Error("A senha antiga informada está incorreta");
    }

    return isOldPasswordValid;
  }
}
