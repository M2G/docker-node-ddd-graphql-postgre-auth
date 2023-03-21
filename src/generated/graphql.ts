/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
import { Context } from './src/interfaces/schema-definition/types';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  deleteUser?: Maybe<User>;
  forgotPassword: Status;
  resetPassword: Status;
  signin: Scalars['String'];
  signup: User;
  updateUser?: Maybe<User>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSigninArgs = {
  input?: InputMaybe<SigninInput>;
};


export type MutationSignupArgs = {
  input?: InputMaybe<SignupInput>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String'];
  input?: InputMaybe<UpdateUserInput>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  count?: Maybe<Scalars['Int']>;
  next?: Maybe<Scalars['Int']>;
  pages?: Maybe<Scalars['Int']>;
  prev?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  getUser?: Maybe<User>;
  users?: Maybe<Array<Users>>;
};


export type QueryGetUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  filters?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type SigninInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignupInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Status = {
  __typename?: 'Status';
  success?: Maybe<Scalars['Boolean']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Int']>;
  deleted_at?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  last_connected_at?: Maybe<Scalars['Int']>;
  last_name?: Maybe<Scalars['String']>;
  modified_at?: Maybe<Scalars['Int']>;
  password?: Maybe<Scalars['String']>;
  reset_password_expires?: Maybe<Scalars['String']>;
  reset_password_token?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type Users = {
  __typename?: 'Users';
  pageInfo?: Maybe<PageInfo>;
  results?: Maybe<Array<Maybe<User>>>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateUserInput: CreateUserInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  ResetPasswordInput: ResetPasswordInput;
  SigninInput: SigninInput;
  SignupInput: SignupInput;
  Status: ResolverTypeWrapper<Status>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  Users: ResolverTypeWrapper<Users>;
  sortOrder: SortOrder;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  CreateUserInput: CreateUserInput;
  Int: Scalars['Int'];
  Mutation: {};
  PageInfo: PageInfo;
  Query: {};
  ResetPasswordInput: ResetPasswordInput;
  SigninInput: SigninInput;
  SignupInput: SignupInput;
  Status: Status;
  String: Scalars['String'];
  UpdateUserInput: UpdateUserInput;
  User: User;
  Users: Users;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  forgotPassword?: Resolver<ResolversTypes['Status'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  resetPassword?: Resolver<ResolversTypes['Status'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'input'>>;
  signin?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<MutationSigninArgs>>;
  signup?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<MutationSignupArgs>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id'>>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  next?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  prev?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  users?: Resolver<Maybe<Array<ResolversTypes['Users']>>, ParentType, ContextType, Partial<QueryUsersArgs>>;
}>;

export type StatusResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = ResolversObject<{
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_connected_at?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modified_at?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reset_password_expires?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reset_password_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsersResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Users'] = ResolversParentTypes['Users']> = ResolversObject<{
  pageInfo?: Resolver<Maybe<ResolversTypes['PageInfo']>, ParentType, ContextType>;
  results?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Users?: UsersResolvers<ContextType>;
}>;

