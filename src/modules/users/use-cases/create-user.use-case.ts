import { AlreadyExistsError } from '@/common/errors/already-exists-error';
import type { CreateUserRequestDto } from '@/common/validations/users/create-user/create-user-request.dto';
import type { CreateUserResponseDto } from '@/common/validations/users/create-user/create-user-response.dto';
import type { DbService } from '@/modules/db/db.service';
import type { HashService } from '@/modules/hash/hash.service';

export class CreateUserUseCase {
  constructor(
    private readonly dbService: DbService,
    private readonly hashService: HashService,
  ) {}

  async execute(
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const userAlreadyExists = await this.dbService.user.findUnique({
      where: { email: createUserRequestDto.email },
    });

    if (userAlreadyExists) {
      throw new AlreadyExistsError('User', 'email', createUserRequestDto.email);
    }

    const hashedPassword = await this.hashService.hash(
      createUserRequestDto.password,
    );

    return this.dbService.user.create({
      data: { ...createUserRequestDto, password: hashedPassword },
      omit: { password: true },
    });
  }
}
