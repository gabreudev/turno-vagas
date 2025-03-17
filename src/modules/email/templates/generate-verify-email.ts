export function generateVerifyEmail(name: string, link: string): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">Olá, ${name}</h2>
        
        <p style="color: #666666;">Por favor, clique no botão abaixo para verificar seu email.</p>
        
        <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verificar Email</a>
        
        <p style="color: #666666; margin-top: 20px;">Se você não solicitou, por favor, ignore este email. Não é necessário tomar nenhuma ação.</p>
        
        <p style="color: #666666; margin-top: 20px;">Se o botão acima não funcionar, você também pode copiar e colar o seguinte link em seu navegador:</p>
        
        <p style="color: #666666; font-size: 14px; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">${link}</p>
        
        <p style="color: #666666; margin-top: 20px;">Obrigado!</p>
      </div>
    </div>
  `;
}
