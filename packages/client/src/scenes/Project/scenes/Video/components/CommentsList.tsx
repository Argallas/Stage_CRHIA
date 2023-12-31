import {
  AnnotationRecord,
  ProjectGraphRecord,
  UserRecord,
} from "@celluloid/types";
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { AppState } from "types/StateTypes";
import { canAnnotate } from "utils/ProjectUtils";

import Comment from "./Comment";
import CommentEditor from "./CommentEditor";

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      paddingLeft: spacing.unit * 8.5,
      paddingRight: spacing.unit * 7,
    },
    commentCount: {
      color: palette.text.disabled,
      paddingLeft: spacing.unit * 2,
    },
  });

interface Props extends WithStyles<typeof styles> {
  annotation: AnnotationRecord;
  user?: UserRecord;
  project: ProjectGraphRecord;
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
});

const CommentList: React.FC<Props> = ({
  annotation,
  classes,
  user,
  project,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      {annotation.comments.length > 0 && (
        <Typography gutterBottom={true} className={classes.commentCount}>
          {t("annotation.commentLabel", { count: annotation.comments.length })}
        </Typography>
      )}
      {annotation.comments.map((comment) => (
        <Comment
          user={user}
          project={project}
          annotation={annotation}
          comment={comment}
          key={comment.id}
        />
      ))}
      {user && project && canAnnotate(project, user) && (
        <CommentEditor
          user={user}
          annotation={annotation}
          onClickCancel={() => null}
        />
      )}
    </div>
  );
};

export default withStyles(styles)(connect(mapStateToProps)(CommentList));
