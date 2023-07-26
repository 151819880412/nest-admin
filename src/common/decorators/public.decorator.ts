/**
 * 用来储存装饰器
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// 静态
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// 不需要包裹Res
export const Keep = () => SetMetadata('common:transform_keep', true);

/**
 * 使用该注解可开放当前Api权限，无需权限访问，但是仍然需要校验身份Token
 */
export const PermissionOptional = () =>
  SetMetadata('admin_module:permission_optional', true);

/**
 * 日志记录禁用
 */
export const LogDisabled = () => SetMetadata('admin_module:log_disabled', true);

export const Roles = (...roles: string[]) => {
  console.log('roles' + roles);
  return SetMetadata('roles', roles);
};
