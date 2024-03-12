import {ApiModel, ApiModelProperty} from 'swagger-express-ts';

@ApiModel({
  description: 'Model description',
  name: 'resetPassword',
})
export class resetPassword {
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example: 'new password',
  })
  newPassword!: string;
  @ApiModelProperty({
    description: 'name of model',
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODQ0MTE5NDQsImV4cCI6MTY4NDQxMzE0NH0.WGj9G3TV0__9nAjRqHRz5Tbjz6LXAji6Hx0SsD1xWsI',
  })
  resetLink!: string;
}
