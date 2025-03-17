export function generateApprovalNotificationEmail(
  name: string,
  link: string,
): string {
  return `
<div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h2 style="color: #333333;">Conta Aprovada com Sucesso!</h2>
    
    <p style="color: #666666;">Olá ${name},</p>
    
    <p style="color: #666666;">Informamos que sua conta foi aprovada pelos nossos administradores!</p>
    
    <p style="color: #666666;">Você já pode acessar o sistema.</p>

    <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;"> Acessar a Plataforma</a>
    
    <p style="color: #666666;">Caso tenha alguma dúvida, entre em contato com os proprietários.</p>
    
    <p style="color: #666666; margin-top: 20px;">Bem-vindo(a) à equipe!</p>
  </div>
</div>
  `;
}
