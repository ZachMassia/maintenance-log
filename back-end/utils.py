def update_or_create_unit(session, model, verbose=False, **kwargs):
    """Update the model instance if found, otherwise create a new one."""
    unit_num = kwargs['unit_num']
    # Try to find a model with the given unit #.
    instance = session.query(model).filter_by(unit_num=unit_num).first()
    if instance:
        for k, v in kwargs.items():
            if verbose:
                old_val = getattr(instance, k)
                if old_val != v:
                    print('Updated {} for unit {}:\t{}\t-->\t{}'.format(k, unit_num, old_val, v))
            setattr(instance, k, v)
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        if verbose:
            print('New unit added: {}'.format(kwargs['unit_num']))
        return instance
