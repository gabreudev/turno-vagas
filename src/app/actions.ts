'use server';

export const dynamic = async () => 'force-dynamic';

import { GENERIC_ERROR_MESSAGE } from '@/common/constants/generic-error-message';
import type { LoginRequestDto } from '@/common/validations/auth/login/login-request.dto';
import type { LoginResponseDto } from '@/common/validations/auth/login/login-response.dto';
import type { GetHistoryResponseDto } from '@/common/validations/history/get-history/get-history-response.dto';
import type { UpdateHistoryResponseDto } from '@/common/validations/history/history.dto';
import type { UpdateHistoryRequestDto } from '@/common/validations/history/update-history/update-history-request.dto';
import type { UpdateHistoryStringDatesResponseDto } from '@/common/validations/history/update-history/update-history-response.dto';
import type { CreateShiftRequestDto } from '@/common/validations/shift/create-shift/create-shift-request.dto';
import type {
  CreateShiftResponseDto,
  CreateShiftStringDatesResponseDto,
} from '@/common/validations/shift/create-shift/create-shift.reponse.dto';
import type { GetShiftsStringDatesResponseDto } from '@/common/validations/shift/get-shift/get-shifts-response.dto';
import type { UpdateShiftResponseDto } from '@/common/validations/shift/shift.dto';
import type { UpdateShiftRequestDto } from '@/common/validations/shift/update-shifts/update-shift-request.dto';
import type { UpdateShiftStringDatesResponseDto } from '@/common/validations/shift/update-shifts/update-shift-response.dto';
import type { CreateUserRequestDto } from '@/common/validations/users/create-user/create-user-request.dto';
import type {
  CreateUserResponseDto,
  CreateUserStringDatesResponseDto,
} from '@/common/validations/users/create-user/create-user-response.dto';
import type { GetUsersStringDatesResponseDto } from '@/common/validations/users/get-users/get-users-response.dto';
import type { UpdateUserRequestDto } from '@/common/validations/users/update-user/update-user-request.dto';
import type {
  UpdateUserResponseDto,
  UpdateUserStringDatesResponseDto,
} from '@/common/validations/users/update-user/update-user-response.dto';
import { authController } from '@/modules/auth';
import { historiescontroller } from '@/modules/history';
import { shiftsController } from '@/modules/shifts';
import { usersController } from '@/modules/users';
import { getErrorMessage } from '@/utils/get-error-message';

/*
 * Only plain objects and a few built-in functions can be passed to server actions
 */
function deepClone<T, K>(obj: T): K {
  return JSON.parse(JSON.stringify(obj));
}

export type ResponseWithError<T> =
  | {
      ok: true;
      data: T;
      error: undefined;
    }
  | {
      ok: false;
      data: null;
      error: string;
    };

// User
export async function createUser(
  createUserRequestDto: CreateUserRequestDto,
): Promise<ResponseWithError<CreateUserStringDatesResponseDto>> {
  let response: ResponseWithError<CreateUserStringDatesResponseDto> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    const data = deepClone<
      CreateUserResponseDto,
      CreateUserStringDatesResponseDto
    >(await usersController.createUser(createUserRequestDto));

    response = {
      ok: true,
      data,
      error: undefined,
    };
    return response;
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('exists')) {
      response.error = 'Email já cadastrado';
    }
  }

  return response;
}

export async function verifyEmail(
  token: string,
): Promise<ResponseWithError<null>> {
  let response: ResponseWithError<null> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    await usersController.verifyEmail(token);

    response = {
      ok: true,
      data: null,
      error: undefined,
    };

    return response;
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('bad request')) {
      response.error = 'Token inválido ou expirado';
    }
  }

  return response;
}

export async function getUsers(): Promise<GetUsersStringDatesResponseDto> {
  return deepClone(await usersController.getUsers());
}

export async function updateUser(
  id: number,
  updateUserRequestDto: UpdateUserRequestDto,
): Promise<ResponseWithError<UpdateUserStringDatesResponseDto>> {
  let response: ResponseWithError<UpdateUserStringDatesResponseDto> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    const data = deepClone<
      UpdateUserResponseDto,
      UpdateUserStringDatesResponseDto
    >(await usersController.updateUser(id, updateUserRequestDto));

    response = {
      ok: true,
      data,
      error: undefined,
    };

    return response;
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('not found')) {
      response.error = 'Usuário não encontrado';
    }
  }

  return response;
}

// Shifts
export async function createShift(
  createShiftRequestDto: CreateShiftRequestDto,
): Promise<ResponseWithError<CreateShiftStringDatesResponseDto>> {
  let response: ResponseWithError<CreateShiftStringDatesResponseDto> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    const data = deepClone<
      CreateShiftResponseDto,
      CreateShiftStringDatesResponseDto
    >(await shiftsController.createShift(createShiftRequestDto));

    response = {
      ok: true,
      data,
      error: undefined,
    };
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('exists')) {
      response.error = 'Turno já cadastrado';
    }

    if (errorMessageLowerCased.includes('not found')) {
      response.error = 'Usuário não encontrado';
    }
  }

  return response;
}

export async function getShifts(): Promise<GetShiftsStringDatesResponseDto> {
  return deepClone(await shiftsController.getShifts());
}

export async function getShiftsByUser(
  id: number,
): Promise<GetShiftsStringDatesResponseDto> {
  return deepClone(await shiftsController.getShiftsByUser(id));
}

export async function updateShift(
  id: number,
  updateShiftDto: UpdateShiftRequestDto,
): Promise<ResponseWithError<UpdateShiftStringDatesResponseDto>> {
  let response: ResponseWithError<UpdateShiftStringDatesResponseDto> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    const data = deepClone<
      UpdateShiftResponseDto,
      UpdateShiftStringDatesResponseDto
    >(await shiftsController.updateShift(id, updateShiftDto));

    response = {
      ok: true,
      data,
      error: undefined,
    };
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('not found')) {
      response.error = 'Turno não encontrado';
    }
  }

  return response;
}

export async function deleteShift(
  id: number,
): Promise<ResponseWithError<null>> {
  let response: ResponseWithError<null> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    await shiftsController.deleteShift(id);

    response = {
      ok: true,
      data: null,
      error: undefined,
    };
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('not found')) {
      response.error = 'Turno não encontrado';
    }
  }

  return response;
}

// Historys
export async function getHistory(): Promise<GetHistoryResponseDto> {
  return deepClone(await historiescontroller.getHistory());
}

export async function updateHistory(
  id: number,
  updateHistoryRequestDto: UpdateHistoryRequestDto,
): Promise<ResponseWithError<UpdateHistoryStringDatesResponseDto>> {
  let response: ResponseWithError<UpdateHistoryStringDatesResponseDto> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    const data = deepClone<
      UpdateHistoryResponseDto,
      UpdateHistoryStringDatesResponseDto
    >(await historiescontroller.updateHistory(id, updateHistoryRequestDto));

    response = {
      ok: true,
      data,
      error: undefined,
    };
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('not found')) {
      response.error = 'Histórico não encontrado';
    }

    if (errorMessageLowerCased.includes('forbidden')) {
      response.error = 'Horário inválido: já se passaram 24 horas';
    }
  }

  return response;
}

export async function addShiftsToHistory(): Promise<ResponseWithError<null>> {
  let response: ResponseWithError<null> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    await historiescontroller.addShiftsToHistory();

    response = {
      ok: true,
      data: null,
      error: undefined,
    };
  } catch (error) {
    console.error(error);

    // const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    // if (errorMessageLowerCased.includes('test')) {
    //   response.error = 'Test';
    // }
  }

  return response;
}

// Auth
export async function login(
  loginRequestDto: LoginRequestDto,
): Promise<ResponseWithError<LoginResponseDto>> {
  let response: ResponseWithError<LoginResponseDto> = {
    ok: false,
    data: null,
    error: GENERIC_ERROR_MESSAGE,
  };

  try {
    const data = deepClone<LoginResponseDto, LoginResponseDto>(
      await authController.login(loginRequestDto),
    );

    response = {
      ok: true,
      data,
      error: undefined,
    };
  } catch (error) {
    console.error(error);

    const errorMessageLowerCased = getErrorMessage(error).toLowerCase();

    if (errorMessageLowerCased.includes('not found')) {
      response.error = 'Email não encontrado';
    }

    if (errorMessageLowerCased.includes('incorrect password')) {
      response.error = 'Senha incorreta';
    }

    if (errorMessageLowerCased.includes('email not verified')) {
      response.error = 'Email não verificado, verifique sua caixa de spam';
    }

    if (errorMessageLowerCased.includes('unable to login')) {
      response.error =
        'Não é possível fazer login, entre em contato com seu administrador';
    }
  }

  return response;
}
