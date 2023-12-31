import { CommentRecord, UserRecord } from '@celluloid/types';
import { Knex } from 'knex';

import { database, getExactlyOne } from '../backends/Database';
import { Logger } from '../backends/Logger';
import * as ProjectStore from './ProjectStore';

export function selectByAnnotation(annotationId: string, user: Partial<UserRecord>) {
  return database.select(
    database.raw('"Comment".*'),
    database.raw(
      'json_build_object(' +
      `'id', "User"."id",` +
      `'email', "User"."email",` +
      `'username', "User"."username",` +
      `'role', "User"."role"` +
      ') as "user"'))
    .from('Comment')
    .innerJoin('Annotation', 'Annotation.id', 'Comment.annotationId')
    .innerJoin('User', 'User.id', 'Comment.userId')
    .innerJoin('Project', 'Project.id', 'Annotation.projectId')
    .where('Comment.annotationId', annotationId)
    .andWhere((nested: Knex.QueryBuilder) => {
      nested.where('User.id', user.id); 
      nested.modify(ProjectStore.orIsOwner, user);
      nested.modify(ProjectStore.orIsMember, user);
      return nested;
    })
    .orderBy('Comment.createdAt', 'asc');
}

export function selectOne(commentId: string) {

  console.log(commentId, "selectOne")
  return database.select(
    database.raw('"Comment".*'),
    database.raw(
      'json_build_object(' +
      `'id', "User"."id",` +
      `'email', "User"."email",` +
      `'username', "User"."username",` +
      `'role', "User"."role"` +
      ') as "user"'))
    .from('Comment')
    .innerJoin('User', 'User.id', 'Comment.userId')
    .where('Comment.id', commentId)
    .first()
    .then((row?: CommentRecord) => row ? Promise.resolve(row) :
      Promise.reject(new Error('CommentNotFound')));
}

export function insert(annotationId: string, text: string, user: Partial<UserRecord>) {
  return database('Comment')
    .insert({
      annotationId,
      userId: user.id,
      text,
      createdAt: database.raw('NOW()')
    })
    .returning('id')
    .then(getExactlyOne)
    .then(row => selectOne(row.id));
}

export function update(id: string, text: string) {
  return database('Comment')
    .update({
      text
    })
    .where('id', id)
    .returning('id')
    .then(getExactlyOne)
    .then(() => selectOne(id));
}

export function del(id: string) {
  return database('Comment')
    .where('id', id)
    .del();
}