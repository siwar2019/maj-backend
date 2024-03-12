import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'create new privilege',
  name: 'createPrivileges',
})
export class createPrivileges {
  @ApiModelProperty({
    description: 'privilege  name',
    required: true,
    example: 'agent',
  })
  privilegeName!: string;

  @ApiModelProperty({
    description: 'description',
    required: true,
    example: 'description',
  })
  description!: string;
}
@ApiModel({
  description: 'create new privilege',
  name: 'CreateNewItemMenu',
})
export class CreateNewItemMenu {
  @ApiModelProperty({
    description: 'item name',
    required: true,
    example: 'les commandes',
  })
  name!: string;
  @ApiModelProperty({
    description: 'description',
    required: true,
    example: 'liste des commandes',
  })
  description!: string;
  @ApiModelProperty({
    description: 'parentId',
    required: true,
    example: '1',
  })
  parentId!: string;
  @ApiModelProperty({
    description: 'privilegeId',
    required: true,
    example: 1,
  })
  privilegeId!: number;
  @ApiModelProperty({
    description: 'createAccess',
    required: true,
    example: true,
  })
  createAccess!: boolean;
  @ApiModelProperty({
    description: 'readAccess',
    required: true,
    example: true,
  })
  readAccess!: boolean;
  @ApiModelProperty({
    description: 'updateAccess',
    required: true,
    example: true,
  })
  updateAccess!: boolean;
  @ApiModelProperty({
    description: 'deleteAccess',
    required: true,
    example: true,
  })
  deleteAccess!: boolean;
}
@ApiModel({
  description: 'Affect Privilege to agent',
  name: 'AffectPrivilege',
})
export class AffectPrivilege {
  @ApiModelProperty({
    description: 'id de privilege',
    required: true,
    example: 2,
  })
  privilegeId!: number;
  @ApiModelProperty({
    description: 'agent id',
    required: true,
    example: 3,
  })
  agentId!: number;
}
@ApiModel({
  description: 'update privilege',
  name: 'UpdatePrivilege',
})
export class UpdatePrivilege {
  @ApiModelProperty({
    description: 'id de privilege',
    required: true,
    example: 2,
  })
  privilegeId!: number;
  @ApiModelProperty({
    description: 'id de menu',
    required: true,
    example: 2,
  })
  menuId!: number;
  @ApiModelProperty({
    description: 'createAccess',
    required: true,
    example: true,
  })
  createAccess!: boolean;
  @ApiModelProperty({
    description: 'deleteAccess',
    required: true,
    example: true,
  })
  deleteAccess!: boolean;
  @ApiModelProperty({
    description: 'updateAccess',
    required: true,
    example: true,
  })
  updateAccess!: boolean;
  @ApiModelProperty({
    description: 'readAccess',
    required: true,
    example: true,
  })
  readAccess!: boolean;
}