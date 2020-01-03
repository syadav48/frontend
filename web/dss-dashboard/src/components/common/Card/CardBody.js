import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/CardBodyStyles";
import Config from '../../../config/configs'

const useStyles = makeStyles(styles);

export default function CardBody(props) {
  const classes = useStyles();
  const { className, children, plain, profile, page, ...rest } = props;
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes.cardBodyPlain]: plain,
    [classes.cardBodyProfile]: profile,
    [className]: className !== undefined
  });
  let url = Config.DEMO_API_URL + Config.APP_NAME + page

  return (
    <div className={cardBodyClasses} {...rest}>
      <a href={url} style={{ textDecoration: 'none' }}>
        {children}
      </a>

    </div>
  );
}

CardBody.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  children: PropTypes.node
};