export function generateNewShiftNotificationEmail(
  name: string,
  email: string,
  weekDay: string,
  startAt: string,
  endAt: string,
  link: string,
): string {
  return `<div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">Novo Turno Registrado</h2>
        
        <p style="color: #666666;">Olá Administrador,</p>
        
        <p style="color: #666666;">Novo turno cadastrado por um usuário precisa de aprovação:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #666666; margin: 5px 0;">Nome do usuário: <strong>${name}</strong></p>
          <p style="color: #666666; margin: 5px 0;">Email do usuário: <strong>${email}</strong></p>
          <p style="color: #666666; margin: 5px 0;">Dia da semana: <strong>${weekDay}</strong></p>
          <p style="color: #666666; margin: 5px 0;">Horário de entrada: <strong>${startAt}</strong></p>
          <p style="color: #666666; margin: 5px 0;">Horário de saida: <strong>${endAt}</strong></p>
        </div>
        
        <p style="color: #666666;"> Acesse o sistema clicando no botão abaixo:</p>
        <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Acessar Sistema</a>
        
        <p style="color: #666666; margin-top: 20px;">Este é um email automático. Por favor, não responda.</p>
      </div>
    </div>
  `;
}
